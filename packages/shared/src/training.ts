// Host-agnostic training domain: the training vocabulary, the row shapes
// read from the API, display formatting, and the canonical ordering.
//
// Direction of truth: the vocabulary below is declared here and the app
// builds its SELECT options from it, so values flow shared → app → schema.
// The generated schema types are downstream of that, and are used only for
// what they legitimately describe — the shape of API responses — plus the
// assertions further down, which check that what is deployed still matches
// what is declared here.

import type { ProgramExercise, Workout } from './generated/client/schema';

// The API omits empty fields (`field?: T`) but returns null over the wire.
type Nullable<T> = {
  [K in keyof T]-?: undefined extends T[K] ? NonNullable<T[K]> | null : T[K];
};

type AssertEmpty<T extends never> = T;

export const TrainingDay = {
  DAY_A: 'DAY_A',
  DAY_B: 'DAY_B',
  DAY_C: 'DAY_C',
  DAY_D: 'DAY_D',
  DAY_E: 'DAY_E',
  DAY_F: 'DAY_F',
} as const;
export type TrainingDay = (typeof TrainingDay)[keyof typeof TrainingDay];

export const DAY_LABEL: Record<TrainingDay, string> = {
  DAY_A: 'Day A',
  DAY_B: 'Day B',
  DAY_C: 'Day C',
  DAY_D: 'Day D',
  DAY_E: 'Day E',
  DAY_F: 'Day F',
};

export const SetScheme = {
  STRAIGHT: 'STRAIGHT',
  TOP_SET: 'TOP_SET',
  BACKOFF: 'BACKOFF',
  DROPSET: 'DROPSET',
  CLUSTER: 'CLUSTER',
  AMRAP: 'AMRAP',
  EMOM: 'EMOM',
} as const;
export type SetScheme = (typeof SetScheme)[keyof typeof SetScheme];

export const SET_SCHEME_LABEL: Record<SetScheme, string> = {
  STRAIGHT: 'Straight',
  TOP_SET: 'Top set',
  BACKOFF: 'Backoff',
  DROPSET: 'Dropset',
  CLUSTER: 'Cluster',
  AMRAP: 'AMRAP',
  EMOM: 'EMOM',
};

// Compile errors if the deployed metadata drifts from the vocabulary above
// — i.e. if an option was added or removed on the instance without the
// declaration here changing (re-run `yarn schema:types` after `apply`).
export type DeployedDaysMatch = AssertEmpty<
  | Exclude<TrainingDay, NonNullable<Workout['day']>>
  | Exclude<NonNullable<Workout['day']>, TrainingDay>
>;
export type DeployedSetSchemesMatch = AssertEmpty<
  | Exclude<SetScheme, NonNullable<ProgramExercise['setScheme']>>
  | Exclude<NonNullable<ProgramExercise['setScheme']>, SetScheme>
>;

const parseUnion = <T extends string>(
  labels: Record<T, string>,
  value: unknown,
): T | null =>
  typeof value === 'string' &&
  Object.prototype.hasOwnProperty.call(labels, value)
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
  Pick<Workout, 'id' | 'week' | 'order' | 'notes'>
> & { name: string; day: TrainingDay | null };

export type PrescriptionRow = Nullable<
  Pick<
    ProgramExercise,
    | 'id'
    | 'exerciseId'
    | 'order'
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
  setScheme: SetScheme | null;
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
