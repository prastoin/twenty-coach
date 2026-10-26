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
  /** Reps left in the tank. Changes what a set says about strength. */
  rir?: number | null;
  equipmentType?: string | null;
};

/**
 * A one-rep max estimate assumes the load is the resistance and the bar path
 * is the lifter's. On a machine or cable neither holds — leverage and pulley
 * ratios make the printed weight arbitrary — and on bodyweight work the
 * logged kilos are added load, not the total. Unknown equipment gets the
 * benefit of the doubt.
 */
const EQUIPMENT_WITHOUT_ONE_REP_MAX = ['MACHINE', 'CABLE', 'BODYWEIGHT'];

export const supportsOneRepMax = (equipmentType?: string | null): boolean =>
  !EQUIPMENT_WITHOUT_ONE_REP_MAX.includes(equipmentType ?? '');

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

/**
 * Epley on *effective* reps — what the set would have been taken to failure.
 *
 * Reps alone cannot tell strength from effort: eight at RIR 0 and eight at
 * RIR 4 are the same number and four reps apart in what they imply. Adding
 * the reps left in reserve is the standard correction, and the cap then
 * applies to the total, so a set stopped far from failure drops out rather
 * than being estimated from guesswork.
 */
export const estimatedOneRepMax = (
  weightKg: number | null,
  reps: number | null,
  rir?: number | null,
): number | null => {
  if (weightKg === null || reps === null || weightKg <= 0 || reps <= 0) {
    return null;
  }
  const effectiveReps = reps + Math.max(rir ?? 0, 0);
  if (effectiveReps > MAX_REPS_FOR_ESTIMATE) {
    return null;
  }
  return Math.round(weightKg * (1 + effectiveReps / 30) * 10) / 10;
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

/** Every bucket from the first key to the last, including untrained ones. */
const contiguousKeys = (keys: string[], granularity: Granularity): string[] => {
  const sorted = [...keys].sort();
  if (sorted.length === 0) {
    return [];
  }
  const all: string[] = [];
  for (
    let key = sorted[0];
    key <= sorted[sorted.length - 1];
    key = nextBucket(key, granularity)
  ) {
    all.push(key);
  }
  return all;
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

  return contiguousKeys([...byBucket.keys()], granularity).map((key) => {
    const found = byBucket.get(key);
    return {
      start: key,
      tonnage: Math.round(found?.tonnage ?? 0),
      sets: found?.sets ?? 0,
      days: found?.days.size ?? 0,
    };
  });
};

export type PerformedSession = {
  startedAt: string | null;
};

export type CountBucket = {
  start: string;
  count: number;
};

/**
 * Sessions per week or month. Consistency is the thing a coach actually
 * intervenes on, and it cannot be read off set logs: a session where nothing
 * was logged still happened, and a week with none is the signal.
 */
export const sessionsPerBucket = (
  sessions: PerformedSession[],
  granularity: Granularity,
): CountBucket[] => {
  const byBucket = new Map<string, number>();
  for (const session of sessions) {
    if (!session.startedAt) {
      continue;
    }
    const key = bucketStart(session.startedAt, granularity);
    byBucket.set(key, (byBucket.get(key) ?? 0) + 1);
  }
  return contiguousKeys([...byBucket.keys()], granularity).map((key) => ({
    start: key,
    count: byBucket.get(key) ?? 0,
  }));
};

export type OneRepMaxPoint = {
  date: string;
  oneRepMax: number;
  weightKg: number;
  reps: number;
};

export type OneRepMaxSeries = {
  exerciseId: string;
  exerciseName: string;
  points: OneRepMaxPoint[];
  best: number;
  latest: number;
};

/**
 * One series per exercise, one point per training day: the best estimated
 * 1RM of that day. Warm-ups sit below the working sets and drop out by
 * taking the maximum, so they need no special handling.
 *
 * This, not tonnage, is the question an exercise page is asking.
 */
export const oneRepMaxSeries = (sets: PerformedSet[]): OneRepMaxSeries[] => {
  const byExercise = new Map<
    string,
    { name: string; byDay: Map<string, OneRepMaxPoint> }
  >();

  for (const set of sets) {
    if (!supportsOneRepMax(set.equipmentType)) {
      continue;
    }
    const oneRepMax = estimatedOneRepMax(set.weightKg, set.reps, set.rir);
    if (!set.exerciseId || !set.performedAt || oneRepMax === null) {
      continue;
    }
    const exercise = byExercise.get(set.exerciseId) ?? {
      name: set.exerciseName ?? 'Unknown exercise',
      byDay: new Map<string, OneRepMaxPoint>(),
    };
    const day = set.performedAt.slice(0, 10);
    const current = exercise.byDay.get(day);
    if (!current || oneRepMax > current.oneRepMax) {
      exercise.byDay.set(day, {
        date: day,
        oneRepMax,
        weightKg: set.weightKg ?? 0,
        reps: set.reps ?? 0,
      });
    }
    byExercise.set(set.exerciseId, exercise);
  }

  return [...byExercise.entries()]
    .map(([exerciseId, { name, byDay }]) => {
      const points = [...byDay.values()].sort((left, right) =>
        left.date.localeCompare(right.date),
      );
      return {
        exerciseId,
        exerciseName: name,
        points,
        best: Math.max(...points.map((point) => point.oneRepMax)),
        latest: points[points.length - 1]?.oneRepMax ?? 0,
      };
    })
    // Most-trained first: that is what a coach scrolls to.
    .sort(
      (left, right) =>
        right.points.length - left.points.length || right.best - left.best,
    );
};

export type Adherence = {
  logged: number;
  prescribed: number;
  /** Null when nothing was prescribed — not zero, which would read as failure. */
  percent: number | null;
};

export const adherence = (logged: number, prescribed: number): Adherence => ({
  logged,
  prescribed,
  percent: prescribed > 0 ? Math.round((logged / prescribed) * 100) : null,
});

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
    const oneRepMax = supportsOneRepMax(set.equipmentType)
      ? estimatedOneRepMax(set.weightKg, set.reps, set.rir)
      : null;

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

/**
 * Axis ticks a reader can actually use. Dividing the peak by two gives
 * values like 2.6t and 1.3t, which are hard to measure a bar against;
 * rounding the step to 1, 2, 2.5 or 5 of a magnitude gives 3t, 2t, 1t, 0.
 *
 * Returns descending ticks, always ending at zero.
 */
export const niceTicks = (peak: number, count = 4): number[] => {
  if (!Number.isFinite(peak) || peak <= 0) {
    return [0];
  }
  const rawStep = peak / Math.max(count - 1, 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalised = rawStep / magnitude;
  const niceNormalised =
    normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 2.5 ? 2.5 : normalised <= 5 ? 5 : 10;
  const step = niceNormalised * magnitude;
  const top = Math.ceil(peak / step) * step;

  const ticks: number[] = [];
  for (let value = top; value > 0; value -= step) {
    // Floating point: 0.30000000000000004 has no business on an axis.
    ticks.push(Math.round(value * 1e6) / 1e6);
  }
  ticks.push(0);
  return ticks;
};

/**
 * Trailing moving average, null until the window is full.
 *
 * Weekly volume is noisy by design — a deload drops it on purpose — so the
 * bars alone do not answer whether a block is ramping. This does.
 */
export const movingAverage = (
  values: number[],
  window: number,
): (number | null)[] =>
  values.map((_, index) => {
    if (window <= 0 || index < window - 1) {
      return null;
    }
    const slice = values.slice(index - window + 1, index + 1);
    return slice.reduce((total, value) => total + value, 0) / window;
  });

export type CalendarDay = {
  date: string;
  /** Monday-based column index, 0 for the first week shown. */
  week: number;
  /** 0 = Monday … 6 = Sunday. */
  weekday: number;
  count: number;
};

const addDays = (iso: string, days: number): string => {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

/**
 * Every day from the first session's week to the last, as a weekday grid.
 *
 * Counting sessions per day rather than per week is the point: a program is
 * built on weekdays, so "Saturday keeps getting dropped" is a coaching fact
 * that a weekly total cannot express.
 */
export const sessionCalendar = (
  sessions: PerformedSession[],
  today?: string,
): CalendarDay[] => {
  const byDay = new Map<string, number>();
  for (const session of sessions) {
    if (!session.startedAt) {
      continue;
    }
    const day = session.startedAt.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }

  const days = [...byDay.keys()].sort();
  if (days.length === 0) {
    return [];
  }

  const first = bucketStart(days[0], 'week');
  const lastDay = today ?? days[days.length - 1];
  // Run to the end of the week containing the last day, so the grid is whole.
  const last = addDays(bucketStart(lastDay, 'week'), 6);

  const calendar: CalendarDay[] = [];
  let cursor = first;
  let week = 0;
  while (cursor <= last) {
    const date = new Date(`${cursor}T00:00:00Z`);
    const weekday = (date.getUTCDay() + 6) % 7;
    calendar.push({
      date: cursor,
      week,
      weekday,
      count: byDay.get(cursor) ?? 0,
    });
    if (weekday === 6) {
      week += 1;
    }
    cursor = addDays(cursor, 1);
  }
  return calendar;
};

/** Change between the first and last point of a strength series. */
export const oneRepMaxTrendPercent = (
  series: OneRepMaxSeries,
): number | null => {
  if (series.points.length < 2) {
    return null;
  }
  const first = series.points[0].oneRepMax;
  if (first === 0) {
    return null;
  }
  return Math.round(((series.latest - first) / first) * 1000) / 10;
};

/**
 * Ticks spanning a range that does not start at zero.
 *
 * Strength sits in a narrow band — 160kg to 190kg — and anchoring that axis
 * at zero flattens every change worth seeing. The floor and ceiling are
 * rounded outwards to the step so the band still reads as round numbers.
 */
export const niceTicksBetween = (
  low: number,
  high: number,
  count = 3,
): number[] => {
  if (!Number.isFinite(low) || !Number.isFinite(high) || high <= low) {
    return niceTicks(Math.max(high, 0), count);
  }
  const rawStep = (high - low) / Math.max(count - 1, 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalised = rawStep / magnitude;
  const niceNormalised =
    normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 2.5 ? 2.5 : normalised <= 5 ? 5 : 10;
  const step = niceNormalised * magnitude;

  const floor = Math.floor(low / step) * step;
  const ceiling = Math.ceil(high / step) * step;
  const ticks: number[] = [];
  for (let value = ceiling; value >= floor - step / 2; value -= step) {
    ticks.push(Math.round(value * 1e6) / 1e6);
  }
  return ticks;
};
