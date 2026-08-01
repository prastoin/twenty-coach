import { useEffect, useState } from 'react';
import {
  DAY_LABEL,
  formatLoad,
  formatRest,
  formatSetsAndReps,
  type PrescriptionRow,
  type WorkoutRow,
} from '@coach-twenty/shared';

import { fetchActiveProgram, type ActiveProgram } from './program';

type State =
  | { step: 'loading' }
  | { step: 'empty' }
  | { step: 'ready'; program: ActiveProgram }
  | { step: 'error'; message: string };

const PrescriptionItem = ({ row }: { row: PrescriptionRow }) => {
  const load = formatLoad(row);
  const rest = formatRest(row.restSeconds);
  const details = [
    load,
    row.targetRir !== null ? `RIR ${row.targetRir}` : null,
    rest ? `rest ${rest}` : null,
    row.tempo ? `tempo ${row.tempo}` : null,
  ].filter(Boolean);
  return (
    <li className="prescription">
      <div className="prescription-main">
        <span className="prescription-exercise">
          {row.exerciseName ?? row.name}
        </span>
        <span className="prescription-scheme">{formatSetsAndReps(row)}</span>
      </div>
      {details.length > 0 && (
        <div className="prescription-details">{details.join(' · ')}</div>
      )}
      {row.notes && <div className="prescription-notes">{row.notes}</div>}
    </li>
  );
};

const WorkoutCard = ({
  workout,
  prescriptions,
}: {
  workout: WorkoutRow;
  prescriptions: PrescriptionRow[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <article className="workout">
      <button
        className="workout-header"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <div className="workout-title">
          {workout.day && (
            <span className="workout-day">
              {DAY_LABEL[workout.day] ?? workout.day}
            </span>
          )}
          <span className="workout-name">{workout.name}</span>
        </div>
        <span className="workout-meta">
          {prescriptions.length} exercises {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <ul className="prescriptions">
          {prescriptions.map((row) => (
            <PrescriptionItem key={row.id} row={row} />
          ))}
          {prescriptions.length === 0 && (
            <li className="prescription-empty">No prescriptions.</li>
          )}
        </ul>
      )}
      {open && workout.notes && (
        <div className="workout-notes">{workout.notes}</div>
      )}
    </article>
  );
};

export const ProgramScreen = () => {
  const [state, setState] = useState<State>({ step: 'loading' });

  useEffect(() => {
    fetchActiveProgram()
      .then((program) =>
        setState(program ? { step: 'ready', program } : { step: 'empty' }),
      )
      .catch((error) =>
        setState({
          step: 'error',
          message: error instanceof Error ? error.message : String(error),
        }),
      );
  }, []);

  if (state.step === 'loading') {
    return <p className="muted">Loading your program…</p>;
  }
  if (state.step === 'empty') {
    return (
      <p className="muted">
        No active program yet — ask your coach to assign one.
      </p>
    );
  }
  if (state.step === 'error') {
    return <p className="error">{state.message}</p>;
  }

  const { program } = state;
  const weeks = [...new Set(program.workouts.map((w) => w.week))];

  return (
    <div className="program">
      <h2 className="program-name">{program.name}</h2>
      {program.notes && <p className="program-notes">{program.notes}</p>}
      {weeks.map((week) => (
        <section key={week ?? 'none'} className="week">
          <h3 className="week-title">
            {week !== null ? `Week ${week}` : 'Unscheduled'}
          </h3>
          {program.workouts
            .filter((workout) => workout.week === week)
            .map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                prescriptions={
                  program.prescriptionsByWorkout.get(workout.id) ?? []
                }
              />
            ))}
        </section>
      ))}
    </div>
  );
};
