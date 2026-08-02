import { useState } from 'react';
import {
  formatLoad,
  formatSetsAndReps,
  type LoggedSet,
  type PrescriptionRow,
} from '@coach-twenty/shared';

type Props = {
  prescription: PrescriptionRow;
  logged: LoggedSet[];
  setNumber: number;
  isComplete: boolean;
  onLog: (values: {
    reps: number | null;
    weightKg: number | null;
    rir: number | null;
  }) => Promise<void>;
};

const numberOrNull = (value: string): number | null =>
  value.trim() === '' ? null : Number(value);

// One prescription: what the coach asked for, the sets already in, and the
// inputs for the next one — prefilled from the target so a set on plan is
// two taps.
export const SetRow = ({
  prescription,
  logged,
  setNumber,
  isComplete,
  onLog,
}: Props) => {
  const [reps, setReps] = useState(
    prescription.targetRepsMin !== null ? String(prescription.targetRepsMin) : '',
  );
  const [weight, setWeight] = useState(
    prescription.targetWeightKg !== null ? String(prescription.targetWeightKg) : '',
  );
  const [rir, setRir] = useState(
    prescription.targetRir !== null ? String(prescription.targetRir) : '',
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onLog({
        reps: numberOrNull(reps),
        weightKg: numberOrNull(weight),
        rir: numberOrNull(rir),
      });
    } finally {
      setSaving(false);
    }
  };

  const load = formatLoad(prescription);

  return (
    <article className={`exercise${isComplete ? ' exercise-done' : ''}`}>
      <header className="exercise-header">
        <span className="exercise-name">
          {prescription.exerciseName ?? prescription.name}
        </span>
        <span className="exercise-target">
          {formatSetsAndReps(prescription)}
          {load ? ` · ${load}` : ''}
        </span>
      </header>

      {logged.length > 0 && (
        <ul className="logged-sets">
          {logged.map((set) => (
            <li key={set.id} className="logged-set">
              ✓ set {set.setNumber}
            </li>
          ))}
        </ul>
      )}

      {isComplete ? (
        <p className="exercise-complete">All sets logged</p>
      ) : (
        <div className="set-entry">
          <span className="set-entry-label">Set {setNumber}</span>
          <label className="field">
            <span>reps</span>
            <input
              inputMode="numeric"
              value={reps}
              onChange={(event) => setReps(event.target.value)}
            />
          </label>
          <label className="field">
            <span>kg</span>
            <input
              inputMode="decimal"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
          </label>
          <label className="field">
            <span>RIR</span>
            <input
              inputMode="numeric"
              value={rir}
              onChange={(event) => setRir(event.target.value)}
            />
          </label>
          <button className="log-set" onClick={save} disabled={saving}>
            {saving ? '…' : 'Log'}
          </button>
        </div>
      )}
    </article>
  );
};
