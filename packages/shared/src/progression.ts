/**
 * Training volume over time.
 *
 * Volume here means tonnage — weight times reps, summed. It is the blunt
 * measure of how much work was done, and the one that answers "is this block
 * harder than the last one".
 *
 * Buckets are contiguous: a week or month with no training is emitted with a
 * zero tonnage rather than skipped. A chart that silently closes the gap
 * shows an unbroken line through a month off, which is the opposite of what
 * happened.
 */

export type PerformedSet = {
  exerciseId: string | null;
  exerciseName: string | null;
  reps: number | null;
  weightKg: number | null;
  performedAt: string | null;
};

export type Granularity = 'week' | 'month';

export type VolumeBucket = {
  /** ISO date (YYYY-MM-DD) the bucket starts on. */
  start: string;
  tonnage: number;
  sets: number;
  /** Distinct days trained in the bucket. */
  days: number;
};

export type ExerciseVolume = {
  exerciseId: string;
  exerciseName: string;
  tonnage: number;
  sets: number;
  /** Best estimated 1RM seen, null when every set was too high-rep. */
  bestOneRepMax: number | null;
};

/**
 * Epley stops being meaningful much past a dozen reps, so high-rep and AMRAP
 * sets are left out of the strength estimate rather than inflating it. They
 * still count towards tonnage.
 */
export const MAX_REPS_FOR_ESTIMATE = 12;

export const estimatedOneRepMax = (
  weightKg: number | null,
  reps: number | null,
): number | null => {
  if (
    weightKg === null ||
    reps === null ||
    weightKg <= 0 ||
    reps <= 0 ||
    reps > MAX_REPS_FOR_ESTIMATE
  ) {
    return null;
  }
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
};

export const setVolume = (set: PerformedSet): number =>
  (set.weightKg ?? 0) * (set.reps ?? 0);

const toUtcDate = (iso: string): Date => new Date(`${iso.slice(0, 10)}T00:00:00Z`);

const toIsoDay = (date: Date): string => date.toISOString().slice(0, 10);

/** Monday for a week, the 1st for a month. */
export const bucketStart = (iso: string, granularity: Granularity): string => {
  const date = toUtcDate(iso);
  if (granularity === 'month') {
    date.setUTCDate(1);
    return toIsoDay(date);
  }
  const mondayOffset = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - mondayOffset);
  return toIsoDay(date);
};

const nextBucket = (iso: string, granularity: Granularity): string => {
  const date = toUtcDate(iso);
  if (granularity === 'month') {
    date.setUTCMonth(date.getUTCMonth() + 1);
  } else {
    date.setUTCDate(date.getUTCDate() + 7);
  }
  return toIsoDay(date);
};

export const volumeBuckets = (
  sets: PerformedSet[],
  granularity: Granularity,
): VolumeBucket[] => {
  const byBucket = new Map<string, { tonnage: number; sets: number; days: Set<string> }>();

  for (const set of sets) {
    if (!set.performedAt) {
      continue;
    }
    const key = bucketStart(set.performedAt, granularity);
    const current = byBucket.get(key) ?? {
      tonnage: 0,
      sets: 0,
      days: new Set<string>(),
    };
    current.tonnage += setVolume(set);
    current.sets += 1;
    current.days.add(set.performedAt.slice(0, 10));
    byBucket.set(key, current);
  }

  const keys = [...byBucket.keys()].sort();
  if (keys.length === 0) {
    return [];
  }

  const buckets: VolumeBucket[] = [];
  for (
    let key = keys[0];
    key <= keys[keys.length - 1];
    key = nextBucket(key, granularity)
  ) {
    const found = byBucket.get(key);
    buckets.push({
      start: key,
      tonnage: Math.round(found?.tonnage ?? 0),
      sets: found?.sets ?? 0,
      days: found?.days.size ?? 0,
    });
  }
  return buckets;
};

export const totalVolume = (sets: PerformedSet[]): number =>
  Math.round(sets.reduce((total, set) => total + setVolume(set), 0));

/** Tonnage per exercise, heaviest contributor first. */
export const volumeByExercise = (sets: PerformedSet[]): ExerciseVolume[] => {
  const byExercise = new Map<string, ExerciseVolume>();

  for (const set of sets) {
    if (!set.exerciseId) {
      continue;
    }
    const current = byExercise.get(set.exerciseId) ?? {
      exerciseId: set.exerciseId,
      exerciseName: set.exerciseName ?? 'Unknown exercise',
      tonnage: 0,
      sets: 0,
      bestOneRepMax: null,
    };
    const oneRepMax = estimatedOneRepMax(set.weightKg, set.reps);

    byExercise.set(set.exerciseId, {
      ...current,
      tonnage: current.tonnage + setVolume(set),
      sets: current.sets + 1,
      bestOneRepMax:
        oneRepMax !== null &&
        (current.bestOneRepMax === null || oneRepMax > current.bestOneRepMax)
          ? oneRepMax
          : current.bestOneRepMax,
    });
  }

  return [...byExercise.values()]
    .map((exercise) => ({ ...exercise, tonnage: Math.round(exercise.tonnage) }))
    .sort((left, right) => right.tonnage - left.tonnage);
};

/**
 * Change between the first and last non-empty bucket, as a percentage.
 * Null when there is not enough history to compare.
 */
export const volumeTrendPercent = (buckets: VolumeBucket[]): number | null => {
  const trained = buckets.filter((bucket) => bucket.tonnage > 0);
  if (trained.length < 2) {
    return null;
  }
  const first = trained[0].tonnage;
  const last = trained[trained.length - 1].tonnage;
  if (first === 0) {
    return null;
  }
  return Math.round(((last - first) / first) * 1000) / 10;
};
