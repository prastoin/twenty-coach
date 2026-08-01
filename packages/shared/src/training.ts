// Host-agnostic training domain: row shapes as the API returns them,
// display formatting, and the canonical ordering used by every surface.

export type WorkoutRow = {
  id: string;
  name: string;
  day: string | null;
  week: number | null;
  order: number | null;
  notes: string | null;
};

export type PrescriptionRow = {
  id: string;
  name: string;
  exerciseId: string | null;
  order: number | null;
  setScheme: string | null;
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

export const DAY_LABEL: Record<string, string> = {
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
