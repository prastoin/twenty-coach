// Host-agnostic training domain: row shapes as the API returns them,
// display formatting, and the canonical ordering used by every surface.
//
// The rows are deliberately a projection of the API entities — the fields
// the UI reads, with nulls instead of the generated schema's optionals.
// Deriving them from `CoreSchema` is not possible here: those types only
// exist once the client is generated against a live instance (the
// published package ships `type CoreSchema = {}`), and this package must
// stay dependency-free. See #31.

export const TRAINING_DAYS = [
  'DAY_A',
  'DAY_B',
  'DAY_C',
  'DAY_D',
  'DAY_E',
  'DAY_F',
] as const;
export type TrainingDay = (typeof TRAINING_DAYS)[number];

export const SET_SCHEMES = [
  'STRAIGHT',
  'TOP_SET',
  'BACKOFF',
  'DROPSET',
  'CLUSTER',
  'AMRAP',
  'EMOM',
] as const;
export type SetScheme = (typeof SET_SCHEMES)[number];

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

export type WorkoutRow = {
  id: string;
  name: string;
  day: TrainingDay | null;
  week: number | null;
  order: number | null;
  notes: string | null;
};

export type PrescriptionRow = {
  id: string;
  name: string;
  exerciseId: string | null;
  order: number | null;
  setScheme: SetScheme | null;
  targetSets: number | null;
  targetRepsMin: number | null;
  targetRepsMax: number | null;
  targetWeightKg: number | null;
  targetPercent1Rm: number | null;
  targetRir: number | null;
  restSeconds: number | null;
  tempo: string | null;
  notes: string | null;
  exerciseName: string | null;
  workoutId: string | null;
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
