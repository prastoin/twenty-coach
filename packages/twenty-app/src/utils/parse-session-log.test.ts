import { describe, expect, it } from 'vitest';

import { parseSessionLog } from 'src/utils/parse-session-log';

// A real session as typed on a phone, kept verbatim: trailing spaces, a
// French exercise name, a half rep, dropped trailing columns and an `x3`.
const REAL_SESSION_LOG = `Ohp barbell
Wu 20
60 l 6 l 0 l 230 l slow l good
60 l 5 l 0 l 230 l slow l good hard
60 l 4.5 l 0 l 230 l slow

Pecs press 3
Wu 40 80
120 l 7 l 0 l 230 l slow l good and hard
120 l 5 l 0 l 230 l slow+ l good
120 l 3.5 l 0 l 230 l slow l ooof

Katana triceps câble
Wu 12.5
17.5 l 6 l 0 l 200 l slow l left limiting ( started right )
17.5 l 7 l 0 l 200 l slow
17.5 l 7 l 0 l 200 l slow
17.5 l 7 l 0

Lat raises
13.75 l 6 l 0 l x3`;

describe('parseSessionLog', () => {
  const { exercises, warnings } = parseSessionLog(REAL_SESSION_LOG);

  it('should find every exercise, trimming the names', () => {
    expect(exercises.map((exercise) => exercise.name)).toEqual([
      'Ohp barbell',
      'Pecs press 3',
      'Katana triceps câble',
      'Lat raises',
    ]);
  });

  it('should not warn on a well-formed log', () => {
    expect(warnings).toEqual([]);
  });

  it('should map columns to weight, reps, rir, rest, tempo and notes', () => {
    const [firstWorkingSet] = exercises[0].sets.filter((set) => !set.isWarmUp);

    expect(firstWorkingSet).toEqual({
      weightKg: 60,
      reps: 6,
      rir: 0,
      restSeconds: 230,
      tempo: 'slow',
      notes: 'good',
      isWarmUp: false,
    });
  });

  it('should keep fractional reps', () => {
    const reps = exercises[0].sets
      .filter((set) => !set.isWarmUp)
      .map((set) => set.reps);

    expect(reps).toEqual([6, 5, 4.5]);
  });

  it('should read each warm-up load as its own set', () => {
    const pecsWarmUps = exercises[1].sets.filter((set) => set.isWarmUp);

    expect(pecsWarmUps.map((set) => set.weightKg)).toEqual([40, 80]);
    expect(pecsWarmUps.every((set) => set.reps === null)).toBe(true);
  });

  it('should keep a tempo variant distinct', () => {
    const tempos = exercises[1].sets
      .filter((set) => !set.isWarmUp)
      .map((set) => set.tempo);

    expect(tempos).toEqual(['slow', 'slow+', 'slow']);
  });

  it('should keep separator-shaped characters inside the notes', () => {
    expect(exercises[2].sets[1].notes).toBe('left limiting ( started right )');
  });

  it('should null out columns dropped from the right', () => {
    const katanaSets = exercises[2].sets;
    const lastKatanaSet = katanaSets[katanaSets.length - 1];

    expect(lastKatanaSet).toMatchObject({
      weightKg: 17.5,
      reps: 7,
      rir: 0,
      restSeconds: null,
      tempo: null,
      notes: null,
    });
  });

  it('should expand an xN token into N identical sets', () => {
    const latRaises = exercises[3].sets;

    expect(latRaises).toHaveLength(3);
    expect(latRaises.every((set) => set.weightKg === 13.75 && set.reps === 6)).toBe(
      true,
    );
    expect(latRaises.every((set) => set.restSeconds === null)).toBe(true);
  });

  it('should report a stray set line instead of throwing', () => {
    const { exercises: none, warnings: strayWarnings } =
      parseSessionLog('60 l 6 l 0');

    expect(none).toEqual([]);
    expect(strayWarnings).toHaveLength(1);
  });

  it('should report the dialect it applied', () => {
    expect(parseSessionLog(REAL_SESSION_LOG).dialect).toMatchObject({
      separator: ['l', '|', '/'],
      weightUnit: 'kg',
      warmUpPrefix: 'wu',
    });
  });
});

describe('parseSessionLog dialects', () => {
  it('should accept another separator and column order', () => {
    const { exercises } = parseSessionLog(
      ['Squat', '5 ; 100 ; 2', '5 ; 102.5 ; 1'].join('\n'),
      { separator: ';', columns: ['reps', 'weight', 'rir'] },
    );

    expect(exercises[0].sets).toEqual([
      {
        weightKg: 100,
        reps: 5,
        rir: 2,
        restSeconds: null,
        tempo: null,
        notes: null,
        isWarmUp: false,
      },
      {
        weightKg: 102.5,
        reps: 5,
        rir: 1,
        restSeconds: null,
        tempo: null,
        notes: null,
        isWarmUp: false,
      },
    ]);
  });

  it('should convert pounds to kilograms', () => {
    const { exercises } = parseSessionLog(['Bench', '225 | 5'].join('\n'), {
      separator: '|',
      columns: ['weight', 'reps'],
      weightUnit: 'lb',
    });

    expect(exercises[0].sets[0].weightKg).toBe(102.06);
  });

  it('should drop columns marked skip', () => {
    const { exercises } = parseSessionLog(
      ['Row', '1 - 80 - 8'].join('\n'),
      { separator: '-', columns: ['skip', 'weight', 'reps'] },
    );

    expect(exercises[0].sets[0]).toMatchObject({ weightKg: 80, reps: 8 });
  });

  it('should honour another warm-up prefix', () => {
    const { exercises } = parseSessionLog(
      ['Deadlift', 'échauffement 60 80', '140 | 3'].join('\n'),
      {
        separator: '|',
        columns: ['weight', 'reps'],
        warmUpPrefix: 'échauffement',
      },
    );

    const warmUps = exercises[0].sets.filter((set) => set.isWarmUp);
    expect(warmUps.map((set) => set.weightKg)).toEqual([60, 80]);
  });
});
