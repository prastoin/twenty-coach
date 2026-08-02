import { useState } from 'react';
import {
  formatLoad,
  formatSetsAndReps,
  prefillWeight,
  type LoggedSet,
  type PrescriptionRow,
} from '@coach-twenty/shared';

export type SetValues = {
  reps: number | null;
  weightKg: number | null;
  rir: number | null;
  comment: string | null;
};

const numberOrNull = (value: string): number | null =>
  value.trim() === '' ? null : Number(value);

const text = (value: number | null): string =>
  value === null ? '' : String(value);

// The inputs used both for a new set and for correcting a logged one.
const SetFields = ({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: SetValues;
  submitLabel: string;
  onSubmit: (values: SetValues) => Promise<void>;
  onCancel?: () => void;
}) => {
  const [reps, setReps] = useState(text(initial.reps));
  const [weight, setWeight] = useState(text(initial.weightKg));
  const [rir, setRir] = useState(text(initial.rir));
  const [comment, setComment] = useState(initial.comment ?? '');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        reps: numberOrNull(reps),
        weightKg: numberOrNull(weight),
        rir: numberOrNull(rir),
        comment: comment.trim() === '' ? null : comment.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="set-fields">
      <div className="set-numbers">
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
            inputMode="decimal"
            value={rir}
            onChange={(event) => setRir(event.target.value)}
          />
        </label>
        <button className="log-set" onClick={submit} disabled={saving}>
          {saving ? '…' : submitLabel}
        </button>
      </div>
      <input
        className="note-input"
        placeholder="Note (optional)"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      {onCancel && (
        <button className="link-button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  );
};

const LoggedSetRow = ({
  set,
  onSave,
}: {
  set: LoggedSet;
  onSave: (values: SetValues) => Promise<void>;
}) => {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="logged-set editing">
        <span className="logged-set-label">Set {set.setNumber}</span>
        <SetFields
          initial={set}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
          onSubmit={async (values) => {
            await onSave(values);
            setEditing(false);
          }}
        />
      </li>
    );
  }

  const parts = [
    set.reps !== null ? `${set.reps} reps` : null,
    set.weightKg !== null ? `${set.weightKg} kg` : null,
    set.rir !== null ? `RIR ${set.rir}` : null,
  ].filter(Boolean);

  return (
    <li className="logged-set">
      <button className="logged-set-button" onClick={() => setEditing(true)}>
        <span className="logged-set-label">✓ Set {set.setNumber}</span>
        <span className="logged-set-values">{parts.join(' · ') || '—'}</span>
        <span className="logged-set-edit">edit</span>
      </button>
      {set.comment && <p className="logged-set-note">{set.comment}</p>}
    </li>
  );
};

type Props = {
  prescription: PrescriptionRow;
  logged: LoggedSet[];
  allLogged: LoggedSet[];
  lastWeightByExercise: Map<string, number>;
  setNumber: number;
  isComplete: boolean;
  onLog: (values: SetValues) => Promise<void>;
  onUpdate: (setId: string, values: SetValues) => Promise<void>;
};

export const SetRow = ({
  prescription,
  logged,
  allLogged,
  lastWeightByExercise,
  setNumber,
  isComplete,
  onLog,
  onUpdate,
}: Props) => {
  const load = formatLoad(prescription);
  const suggestedWeight = prefillWeight(
    allLogged,
    prescription,
    lastWeightByExercise,
  );

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
      {prescription.notes && (
        <p className="coach-note">{prescription.notes}</p>
      )}

      {logged.length > 0 && (
        <ul className="logged-sets">
          {logged.map((set) => (
            <LoggedSetRow
              key={set.id}
              set={set}
              onSave={(values) => onUpdate(set.id, values)}
            />
          ))}
        </ul>
      )}

      {isComplete ? (
        <p className="exercise-complete">All sets logged</p>
      ) : (
        <div className="set-entry">
          <span className="set-entry-label">Set {setNumber}</span>
          <SetFields
            // Remount when the set number or the suggested weight changes,
            // so logging or correcting a set updates what the next one
            // starts from instead of keeping stale input state.
            key={`${prescription.id}-${setNumber}-${suggestedWeight}`}
            initial={{
              reps: prescription.targetRepsMin,
              weightKg: suggestedWeight,
              rir: prescription.targetRir,
              comment: null,
            }}
            submitLabel="Log"
            onSubmit={onLog}
          />
        </div>
      )}
    </article>
  );
};
