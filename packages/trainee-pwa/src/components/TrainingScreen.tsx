import { useCallback, useEffect, useState } from 'react';
import {
  DAY_LABEL,
  formatLoad,
  formatSetsAndReps,
  isPrescriptionComplete,
  nextSetNumber,
  sessionProgress,
  setsForPrescription,
  type LoggedSet,
  type SessionRow,
} from '@coach-twenty/shared';

import { SetRow, type SetValues } from './SetRow';
import { type NextSession, type TraineeIds } from '../services/session';
import { startAutoSync, type SyncState } from '../services/sync';
import {
  editSetLocally,
  finishSessionLocally,
  loadTrainingView,
  logSetLocally,
  resolveTraineeIds,
  startSessionLocally,
  type TrainingView,
} from '../services/training';

type Screen =
  | { step: 'loading' }
  | { step: 'error'; message: string }
  | { step: 'program'; view: TrainingView };

export const TrainingScreen = () => {
  const [screen, setScreen] = useState<Screen>({ step: 'loading' });
  const [trainee, setTrainee] = useState<TraineeIds>({
    personId: null,
    workspaceMemberId: null,
  });
  const [session, setSession] = useState<SessionRow | null>(null);
  const [logged, setLogged] = useState<LoggedSet[]>([]);
  const [sync, setSync] = useState<SyncState>({ pending: 0, error: null });
  const [busy, setBusy] = useState(false);

  const fail = useCallback((error: unknown) => {
    setScreen({
      step: 'error',
      message: error instanceof Error ? error.message : String(error),
    });
  }, []);

  const load = useCallback(async () => {
    setScreen({ step: 'loading' });
    try {
      void resolveTraineeIds().then(setTrainee);

      const view = await loadTrainingView();
      setScreen({ step: 'program', view });
      if (view.state.step === 'ready') {
        setSession(view.state.next.openSession);
        setLogged(view.state.next.loggedSets);
      }
    } catch (error) {
      fail(error);
    }
  }, [fail]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => startAutoSync(setSync), []);

  const start = async (next: NextSession) => {
    setBusy(true);
    try {
      setSession(await startSessionLocally(next, trainee));
      setLogged([]);
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  const finish = async () => {
    if (!session) {
      return;
    }
    setBusy(true);
    try {
      await finishSessionLocally(session);
      setSession(null);
      setLogged([]);
      await load();
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  if (screen.step === 'loading') {
    return <p className="muted">Loading…</p>;
  }
  if (screen.step === 'error') {
    return (
      <>
        <p className="error">{screen.message}</p>
        <button className="primary" onClick={() => void load()}>
          Retry
        </button>
      </>
    );
  }
  if (screen.view.state.step === 'noProgram') {
    return (
      <p className="muted">
        No active program yet — ask your coach to assign one.
      </p>
    );
  }
  if (screen.view.state.step === 'programComplete') {
    return (
      <div className="done-state">
        <p className="done-emoji">🎉</p>
        <p className="done-title">
          {screen.view.state.programName} complete
        </p>
        <p className="muted">Every session logged. Ask your coach what's next.</p>
      </div>
    );
  }

  if (screen.view.state.step === 'ready' && screen.view.awaitingSync) {
    return (
      <div className="done-state">
        <p className="done-emoji">📶</p>
        <p className="done-title">Session saved on this device</p>
        <p className="muted">
          Reconnect to send it and get your next session.
        </p>
      </div>
    );
  }

  const { next } = screen.view.state;
  const progress = sessionProgress(logged, next.prescriptions);

  return (
    <>
      {(screen.view.offline || sync.pending > 0) && (
        <p
          className={`sync-strip${screen.view.offline ? ' sync-offline' : ''}${
            sync.error && !screen.view.offline ? ' sync-stuck' : ''
          }`}
        >
          {screen.view.offline ? 'Offline' : 'Saving'}
          {sync.pending > 0
            ? ` · ${sync.pending} change${sync.pending > 1 ? 's' : ''} waiting`
            : ' · everything saved on this device'}
          {/* A record the server keeps refusing would otherwise retry
              forever with nothing to show for it. */}
          {sync.error && !screen.view.offline ? ` · ${sync.error}` : ''}
        </p>
      )}
      <p className="program-name">{next.programName}</p>

      <section className="session-card">
        <div className="session-head">
          {next.workout.day && (
            <span className="workout-day">{DAY_LABEL[next.workout.day]}</span>
          )}
          <span className="workout-name">{next.workout.name}</span>
        </div>
        <p className="session-meta">
          {next.workout.week !== null ? `Week ${next.workout.week} · ` : ''}
          {next.prescriptions.length} exercises
          {session ? ` · ${progress.done}/${progress.total} sets` : ''}
        </p>
        {!session && (
          <button
            className="primary block"
            onClick={() => void start(next)}
            disabled={busy}
          >
            {busy ? 'Starting…' : 'Start session'}
          </button>
        )}
      </section>

      {session ? (
        <>
          {next.prescriptions.map((prescription) => {
            const setNumber = nextSetNumber(logged, prescription.id);
            return (
            <SetRow
              key={prescription.id}
              prescription={prescription}
              logged={setsForPrescription(logged, prescription.id)}
              setNumber={setNumber}
              isComplete={isPrescriptionComplete(logged, prescription)}
              allLogged={logged}
              lastWeightByExercise={screen.view.lastWeights}
              onLog={async (values: SetValues) => {
                const set = await logSetLocally({
                  sessionId: session.id,
                  prescription,
                  setNumber,
                  traineeMemberId: trainee.workspaceMemberId,
                  ...values,
                });
                setLogged((current) => [...current, set]);
              }}
              onUpdate={async (setId: string, values: SetValues) => {
                const previous = logged.find((set) => set.id === setId);
                if (!previous) {
                  return;
                }
                const set = await editSetLocally(setId, values, previous);
                setLogged((current) =>
                  current.map((existing) =>
                    existing.id === set.id ? set : existing,
                  ),
                );
              }}
            />
            );
          })}
          <button
            className="finish block"
            onClick={() => void finish()}
            disabled={busy}
          >
            {busy ? 'Finishing…' : 'Finish session'}
          </button>
        </>
      ) : (
        <ul className="preview">
          {next.prescriptions.map((prescription) => {
            const load = formatLoad(prescription);
            return (
              <li key={prescription.id} className="preview-row">
                <span>{prescription.exerciseName ?? prescription.name}</span>
                <span className="preview-target">
                  {formatSetsAndReps(prescription)}
                  {load ? ` · ${load}` : ''}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
