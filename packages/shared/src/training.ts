// Host-agnostic training domain: row shapes projected from the workspace
// schema, display formatting, and the canonical ordering used by every
// surface.
//
// The row types derive from the committed schema types (`yarn schema:types`)
// so field names, value sets and scalar types come from the metadata rather
// than being retyped by hand. Only the UI's field selection and the
// null-instead-of-optional convention live here.

import { SCHEMA_ENUMS } from './generated/enums';
import type { ProgramExercise, Workout } from './generated/schema';

// The API omits empty fields (`field?: T`) but returns null over the wire.
type Nullable<T> = {
  [K in keyof T]-?: undefined extends T[K] ? NonNullable<T[K]> | null : T[K];
};

export type TrainingDay = NonNullable<Workout['day']>;
export type SetScheme = NonNullable<ProgramExercise['setScheme']>;

// Values and labels come from the metadata; `satisfies` ties each map to the
// field that uses it, so a renamed enum or a new option is a compile error.
export const DAY_LABEL = SCHEMA_ENUMS.WorkoutDayEnum satisfies Record<
  TrainingDay,
  string
>;
export const SET_SCHEME_LABEL =
  SCHEMA_ENUMS.ProgramExerciseSetSchemeEnum satisfies Record<SetScheme, string>;

const parseUnion = <T extends string>(
  labels: Record<T, string>,
  value: unknown,
): T | null =>
  typeof value === 'string' && Object.hasOwn(labels, value)
    ? (value as T)
    : null;

/** Narrows an API value to a known day, or null for unknown/empty. */
export const parseTrainingDay = (value: unknown): TrainingDay | null =>
  parseUnion(DAY_LABEL, value);

/** Narrows an API value to a known set scheme, or null for unknown/empty. */
export const parseSetScheme = (value: unknown): SetScheme | null =>
  parseUnion(SET_SCHEME_LABEL, value);

// `name` is the label identifier: always rendered, so consumers default it
// rather than carrying a null through every list and comparator.
export type WorkoutRow = Nullable<
  Pick<Workout, 'id' | 'day' | 'week' | 'order' | 'notes'>
> & { name: string };

export type PrescriptionRow = Nullable<
  Pick<
    ProgramExercise,
    | 'id'
    | 'exerciseId'
    | 'order'
    | 'setScheme'
    | 'targetSets'
    | 'targetRepsMin'
    | 'targetRepsMax'
    | 'targetWeightKg'
    | 'targetPercent1Rm'
    | 'targetRir'
    | 'restSeconds'
    | 'tempo'
    | 'notes'
    | 'workoutId'
  >
> & {
  name: string;
  /** Joined from the related exercise, not a field of the prescription. */
  exerciseName: string | null;
};

export const formatRest = (restSeconds: number | null): string | null => {
  if (restSeconds === null || restSeconds === undefined) {
    return null;
  }
  const minutes = Math.floor(restSeconds / 60);
  const seconds = restSeconds % 60;
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return seconds === 0
    ? `${minutes}min`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const formatSetsAndReps = (row: PrescriptionRow): string => {
  const reps =
    row.targetRepsMin !== null && row.targetRepsMax !== null
      ? `${row.targetRepsMin}-${row.targetRepsMax}`
      : row.targetRepsMin !== null
        ? `${row.targetRepsMin}`
        : row.setScheme === 'AMRAP'
          ? 'AMRAP'
          : '?';
  if (row.targetSets === null) {
    return `${reps} reps`;
  }
  return `${row.targetSets}×${reps}`;
};

export const formatLoad = (row: PrescriptionRow): string | null => {
  if (row.targetWeightKg !== null) {
    return `${row.targetWeightKg} kg`;
  }
  if (row.targetPercent1Rm !== null) {
    return `${row.targetPercent1Rm}% 1RM`;
  }
  return null;
};

const nullsLast = (value: number | null): number =>
  value === null ? Number.MAX_SAFE_INTEGER : value;

// APIs don't guarantee ordering — every consumer sorts client-side.
export const compareWorkouts = (a: WorkoutRow, b: WorkoutRow): number =>
  nullsLast(a.week) - nullsLast(b.week) ||
  (a.day ?? '').localeCompare(b.day ?? '') ||
  nullsLast(a.order) - nullsLast(b.order) ||
  a.name.localeCompare(b.name);

export const comparePrescriptions = (
  a: PrescriptionRow,
  b: PrescriptionRow,
): number => nullsLast(a.order) - nullsLast(b.order) || a.name.localeCompare(b.name);
