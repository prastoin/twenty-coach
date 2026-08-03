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

import { fetchCurrentUser } from './api';
import { SetRow, type SetValues } from './SetRow';
import {
  fetchLastWeights,
  fetchProgramState,
  fetchTraineeIds,
  finishSession,
  logSet,
  startSession,
  updateSet,
  type NextSession,
  type ProgramState,
  type TraineeIds,
} from './session';

type Screen =
  | { step: 'loading' }
  | { step: 'error'; message: string }
  | { step: 'program'; state: ProgramState };

export const TrainingScreen = () => {
  const [screen, setScreen] = useState<Screen>({ step: 'loading' });
  const [trainee, setTrainee] = useState<TraineeIds>({
    personId: null,
    workspaceMemberId: null,
  });
  const [session, setSession] = useState<SessionRow | null>(null);
  const [logged, setLogged] = useState<LoggedSet[]>([]);
  const [lastWeights, setLastWeights] = useState<Map<string, number>>(new Map());
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
      const user = await fetchCurrentUser();
      const [ids, state] = await Promise.all([
        fetchTraineeIds(user.workspaceMemberId),
        fetchProgramState(),
      ]);
      setTrainee(ids);
      setScreen({ step: 'program', state });
      if (state.step === 'ready') {
        setSession(state.next.openSession);
        setLogged(state.next.loggedSets);
        setLastWeights(
          await fetchLastWeights(
            state.next.prescriptions
              .map((prescription) => prescription.exerciseId)
              .filter((id): id is string => Boolean(id)),
          ),
        );
      }
    } catch (error) {
      fail(error);
    }
  }, [fail]);

  useEffect(() => {
    void load();
  }, [load]);

  const start = async (next: NextSession) => {
    setBusy(true);
    try {
      setSession(await startSession(next, trainee));
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
      await finishSession(session);
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
  if (screen.state.step === 'noProgram') {
    return (
      <p className="muted">
        No active program yet — ask your coach to assign one.
      </p>
    );
  }
  if (screen.state.step === 'programComplete') {
    return (
      <div className="done-state">
        <p className="done-emoji">🎉</p>
        <p className="done-title">{screen.state.programName} complete</p>
        <p className="muted">Every session logged. Ask your coach what's next.</p>
      </div>
    );
  }

  const { next } = screen.state;
  const progress = sessionProgress(logged, next.prescriptions);

  return (
    <>
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
              lastWeightByExercise={lastWeights}
              onLog={async (values: SetValues) => {
                const set = await logSet({
                  sessionId: session.id,
                  prescription,
                  setNumber,
                  traineeMemberId: trainee.workspaceMemberId,
                  ...values,
                });
                setLogged((current) => [...current, set]);
              }}
              onUpdate={async (setId: string, values: SetValues) => {
                const set = await updateSet({ id: setId, ...values });
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
