// Host-agnostic training domain: row shapes projected from the workspace
// schema, display formatting, and the canonical ordering used by every
// surface.
//
// The row types derive from the committed schema types (`yarn schema:types`)
// so field names, value sets and scalar types come from the metadata rather
// than being retyped by hand. Only the UI's field selection and the
// null-instead-of-optional convention live here.

import type { ProgramExercise, Workout } from './generated/schema';

// The API omits empty fields (`field?: T`) but returns null over the wire.
type Nullable<T> = {
  [K in keyof T]-?: undefined extends T[K] ? NonNullable<T[K]> | null : T[K];
};

type AssertEmpty<T extends never> = T;

export type TrainingDay = NonNullable<Workout['day']>;
export type SetScheme = NonNullable<ProgramExercise['setScheme']>;

export const TRAINING_DAYS = [
  'DAY_A',
  'DAY_B',
  'DAY_C',
  'DAY_D',
  'DAY_E',
  'DAY_F',
] as const satisfies readonly TrainingDay[];

export const SET_SCHEMES = [
  'STRAIGHT',
  'TOP_SET',
  'BACKOFF',
  'DROPSET',
  'CLUSTER',
  'AMRAP',
  'EMOM',
] as const satisfies readonly SetScheme[];

// Compile errors if the metadata gains a value the runtime lists miss.
export type TrainingDaysAreExhaustive = AssertEmpty<
  Exclude<TrainingDay, (typeof TRAINING_DAYS)[number]>
>;
export type SetSchemesAreExhaustive = AssertEmpty<
  Exclude<SetScheme, (typeof SET_SCHEMES)[number]>
>;

const parseUnion = <T extends string>(
  allowed: readonly T[],
  value: unknown,
): T | null =>
  typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;

/** Narrows an API value to a known day, or null for unknown/empty. */
export const parseTrainingDay = (value: unknown): TrainingDay | null =>
  parseUnion(TRAINING_DAYS, value);

/** Narrows an API value to a known set scheme, or null for unknown/empty. */
export const parseSetScheme = (value: unknown): SetScheme | null =>
  parseUnion(SET_SCHEMES, value);

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

export const DAY_LABEL: Record<TrainingDay, string> = {
  DAY_A: 'Day A',
  DAY_B: 'Day B',
  DAY_C: 'Day C',
  DAY_D: 'Day D',
  DAY_E: 'Day E',
  DAY_F: 'Day F',
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
