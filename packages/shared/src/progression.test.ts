import { describe, expect, it } from 'vitest';

import {
  adherence,
  movingAverage,
  niceTicks,
  sessionCalendar,
  bucketStart,
  estimatedOneRepMax,
  oneRepMaxSeries,
  sessionsPerBucket,
  totalVolume,
  volumeByExercise,
  volumeBuckets,
  volumeTrendPercent,
  type PerformedSet,
} from './progression';

const set = (
  performedAt: string,
  weightKg: number | null,
  reps: number | null,
  exerciseId = 'squat',
): PerformedSet => ({
  exerciseId,
  exerciseName: exerciseId,
  reps,
  weightKg,
  performedAt,
});

describe('estimatedOneRepMax', () => {
  it('should apply Epley', () => {
    expect(estimatedOneRepMax(100, 5)).toBe(116.7);
    expect(estimatedOneRepMax(100, 1)).toBe(103.3);
  });

  it('should refuse rep counts where Epley stops meaning anything', () => {
    expect(estimatedOneRepMax(60, 13)).toBeNull();
    expect(estimatedOneRepMax(60, 30)).toBeNull();
  });

  it('should refuse missing or nonsensical input', () => {
    expect(estimatedOneRepMax(null, 5)).toBeNull();
    expect(estimatedOneRepMax(100, null)).toBeNull();
    expect(estimatedOneRepMax(0, 5)).toBeNull();
    expect(estimatedOneRepMax(100, 0)).toBeNull();
  });
});

describe('bucketStart', () => {
  it('should snap a week to its Monday', () => {
    // 2026-10-25 is a Sunday; its week began Monday the 19th.
    expect(bucketStart('2026-10-25', 'week')).toBe('2026-10-19');
    expect(bucketStart('2026-10-19', 'week')).toBe('2026-10-19');
    expect(bucketStart('2026-10-20', 'week')).toBe('2026-10-19');
  });

  it('should snap a month to the first', () => {
    expect(bucketStart('2026-10-25', 'month')).toBe('2026-10-01');
    expect(bucketStart('2026-10-01', 'month')).toBe('2026-10-01');
  });

  it('should ignore the time part', () => {
    expect(bucketStart('2026-10-25T23:30:00.000Z', 'week')).toBe('2026-10-19');
  });
});

describe('volumeBuckets', () => {
  it('should sum tonnage and count distinct training days', () => {
    const [bucket] = volumeBuckets(
      [
        set('2026-10-19', 100, 5),
        set('2026-10-19', 100, 5),
        set('2026-10-21', 50, 10),
      ],
      'week',
    );

    expect(bucket).toEqual({
      start: '2026-10-19',
      tonnage: 1500,
      sets: 3,
      days: 2,
    });
  });

  it('should emit untrained weeks as zero rather than closing the gap', () => {
    const buckets = volumeBuckets(
      [set('2026-10-05', 100, 5), set('2026-10-26', 100, 5)],
      'week',
    );

    expect(buckets.map((bucket) => bucket.start)).toEqual([
      '2026-10-05',
      '2026-10-12',
      '2026-10-19',
      '2026-10-26',
    ]);
    expect(buckets.map((bucket) => bucket.tonnage)).toEqual([500, 0, 0, 500]);
  });

  it('should do the same across months, including a year boundary', () => {
    const buckets = volumeBuckets(
      [set('2026-11-10', 100, 5), set('2027-02-02', 100, 5)],
      'month',
    );

    expect(buckets.map((bucket) => bucket.start)).toEqual([
      '2026-11-01',
      '2026-12-01',
      '2027-01-01',
      '2027-02-01',
    ]);
  });

  it('should skip sets with no date, and return nothing for no sets', () => {
    expect(volumeBuckets([set(null as never, 100, 5)], 'week')).toEqual([]);
    expect(volumeBuckets([], 'week')).toEqual([]);
  });
});

describe('volumeByExercise', () => {
  const sets = [
    set('2026-10-19', 100, 5, 'squat'),
    set('2026-10-19', 100, 5, 'squat'),
    set('2026-10-19', 20, 10, 'curl'),
    set('2026-10-20', 60, 20, 'curl'),
  ];

  it('should rank by tonnage', () => {
    expect(volumeByExercise(sets).map((row) => row.exerciseId)).toEqual([
      'curl',
      'squat',
    ]);
  });

  it('should total tonnage and sets per exercise', () => {
    const [curl, squat] = volumeByExercise(sets);

    expect(curl).toMatchObject({ tonnage: 1400, sets: 2 });
    expect(squat).toMatchObject({ tonnage: 1000, sets: 2 });
  });

  it('should take the best estimate, ignoring sets too high-rep to count', () => {
    const [curl, squat] = volumeByExercise(sets);

    // The 60x20 set is the biggest tonnage but cannot give an estimate.
    expect(curl.bestOneRepMax).toBe(estimatedOneRepMax(20, 10));
    expect(squat.bestOneRepMax).toBe(estimatedOneRepMax(100, 5));
  });

  it('should drop sets with no exercise', () => {
    expect(volumeByExercise([set('2026-10-19', 100, 5, null as never)])).toEqual(
      [],
    );
  });
});

describe('totalVolume', () => {
  it('should treat a missing weight or rep count as zero', () => {
    expect(
      totalVolume([set('2026-10-19', 100, 5), set('2026-10-19', null, 5)]),
    ).toBe(500);
  });
});

describe('volumeTrendPercent', () => {
  it('should compare the first and last trained bucket, ignoring gaps', () => {
    const buckets = volumeBuckets(
      [set('2026-10-05', 100, 5), set('2026-10-26', 150, 5)],
      'week',
    );

    expect(volumeTrendPercent(buckets)).toBe(50);
  });

  it('should return null without two trained buckets', () => {
    expect(volumeTrendPercent(volumeBuckets([set('2026-10-05', 100, 5)], 'week'))).toBeNull();
    expect(volumeTrendPercent([])).toBeNull();
  });
});

describe('sessionsPerBucket', () => {
  it('should count sessions per week and keep untrained weeks at zero', () => {
    const buckets = sessionsPerBucket(
      [
        { startedAt: '2026-10-05' },
        { startedAt: '2026-10-07' },
        { startedAt: '2026-10-26' },
      ],
      'week',
    );

    expect(buckets).toEqual([
      { start: '2026-10-05', count: 2 },
      { start: '2026-10-12', count: 0 },
      { start: '2026-10-19', count: 0 },
      { start: '2026-10-26', count: 1 },
    ]);
  });

  it('should ignore sessions that never started', () => {
    expect(sessionsPerBucket([{ startedAt: null }], 'week')).toEqual([]);
  });
});

describe('oneRepMaxSeries', () => {
  const sets = [
    set('2026-10-19', 100, 5, 'squat'),
    // Same day, heavier: the day keeps its best.
    set('2026-10-19', 110, 5, 'squat'),
    // A warm-up, far below: dropped by taking the max.
    set('2026-10-19', 40, 5, 'squat'),
    set('2026-10-26', 115, 5, 'squat'),
    set('2026-10-19', 20, 10, 'curl'),
  ];

  it('should give one point per training day, best of that day', () => {
    const [squat] = oneRepMaxSeries(sets);

    expect(squat.points.map((point) => point.date)).toEqual([
      '2026-10-19',
      '2026-10-26',
    ]);
    expect(squat.points[0].oneRepMax).toBe(estimatedOneRepMax(110, 5));
  });

  it('should report best and latest', () => {
    const [squat] = oneRepMaxSeries(sets);

    expect(squat.best).toBe(estimatedOneRepMax(115, 5));
    expect(squat.latest).toBe(estimatedOneRepMax(115, 5));
  });

  it('should rank most-trained first', () => {
    expect(oneRepMaxSeries(sets).map((series) => series.exerciseId)).toEqual([
      'squat',
      'curl',
    ]);
  });

  it('should drop sets too high-rep to estimate from', () => {
    expect(oneRepMaxSeries([set('2026-10-19', 60, 20, 'squat')])).toEqual([]);
  });
});

describe('adherence', () => {
  it('should express logged against prescribed', () => {
    expect(adherence(9, 12)).toEqual({
      logged: 9,
      prescribed: 12,
      percent: 75,
    });
  });

  it('should return null rather than zero when nothing was prescribed', () => {
    expect(adherence(5, 0).percent).toBeNull();
  });
});

describe('niceTicks', () => {
  it('should round a scale to numbers worth reading', () => {
    // 2600 / 3 is 866, which rounds up to a step of 1000.
    expect(niceTicks(2600)).toEqual([3000, 2000, 1000, 0]);
  });

  it('should always end at zero and start at or above the peak', () => {
    const ticks = niceTicks(417);

    expect(ticks[ticks.length - 1]).toBe(0);
    expect(ticks[0]).toBeGreaterThanOrEqual(417);
  });

  it('should handle small integer ranges without repeating a tick', () => {
    const ticks = niceTicks(2);

    expect(ticks).toEqual([...new Set(ticks)]);
    expect(ticks).toContain(0);
  });

  it('should degrade to a single zero when there is nothing to scale', () => {
    expect(niceTicks(0)).toEqual([0]);
    expect(niceTicks(-5)).toEqual([0]);
  });
});

describe('movingAverage', () => {
  it('should be null until the window is full, then trail', () => {
    expect(movingAverage([1, 2, 3, 4], 3)).toEqual([null, null, 2, 3]);
  });

  it('should return every value untouched for a window of one', () => {
    expect(movingAverage([5, 7], 1)).toEqual([5, 7]);
  });
});

describe('sessionCalendar', () => {
  it('should lay days out as Monday-based weekday rows', () => {
    // 2026-10-19 is a Monday, 2026-10-21 a Wednesday.
    const calendar = sessionCalendar(
      [{ startedAt: '2026-10-19' }, { startedAt: '2026-10-21' }],
      '2026-10-21',
    );

    expect(calendar).toHaveLength(7);
    expect(calendar[0]).toMatchObject({ date: '2026-10-19', weekday: 0, count: 1 });
    expect(calendar[2]).toMatchObject({ date: '2026-10-21', weekday: 2, count: 1 });
    expect(calendar[1].count).toBe(0);
  });

  it('should count two sessions on one day', () => {
    const calendar = sessionCalendar(
      [{ startedAt: '2026-10-19' }, { startedAt: '2026-10-19' }],
      '2026-10-19',
    );

    expect(calendar[0].count).toBe(2);
  });

  it('should advance the week index across a boundary', () => {
    const calendar = sessionCalendar(
      [{ startedAt: '2026-10-19' }, { startedAt: '2026-10-27' }],
      '2026-10-27',
    );

    expect(calendar.filter((day) => day.week === 0)).toHaveLength(7);
    expect(calendar.find((day) => day.date === '2026-10-27')).toMatchObject({
      week: 1,
      weekday: 1,
    });
  });

  it('should return nothing when no session ever started', () => {
    expect(sessionCalendar([{ startedAt: null }])).toEqual([]);
  });
});
