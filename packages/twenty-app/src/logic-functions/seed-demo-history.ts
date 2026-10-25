import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';

import { TrainingDay } from 'src/constants/training';

// Fills the demo trainee's past with two completed blocks so the coach
// dashboards have something to show. Deliberately not a post-install hook:
// invented training history has no business appearing in a real workspace.
//
// The shape is what a real intermediate lifter's log looks like — gains that
// slow down, a deload every fourth week, sessions that get missed, and loads
// that land on plates that exist.

const BLOCKS = [
  { name: 'PWRBLDNG Block 1', weeksAgo: 22, repsOffset: 3, intensity: 0.88 },
  { name: 'PWRBLDNG Block 2', weeksAgo: 13, repsOffset: 1, intensity: 0.94 },
];

const WEEKS_PER_BLOCK = 4;
const DAYS: string[] = [
  TrainingDay.DAY_A,
  TrainingDay.DAY_B,
  TrainingDay.DAY_C,
  TrainingDay.DAY_D,
];
/** Monday, Wednesday, Friday, Saturday. */
const WEEKDAY_OFFSET = [0, 2, 4, 5];
const MISSED_SESSION_RATE = 0.12;

// Starting loads, roughly a 90kg intermediate lifter.
const STARTING_LOAD: Record<string, number> = {
  'Back Squat': 130,
  'Paused Squat': 105,
  'Front Squat': 95,
  'Bulgarian Split Squat': 30,
  Deadlift: 160,
  'Romanian Deadlift': 110,
  'Good Morning': 70,
  'Bench Press': 92.5,
  'Incline Dumbbell Press': 30,
  'Overhead Press': 55,
  'Seated Dumbbell Shoulder Press': 22,
  Dip: 20,
  'Machine Row': 65,
  'Dumbbell Row': 34,
  'Lat Pulldown': 65,
  'Pull-Up': 10,
  'Face Pull': 25,
  'Cable Curl': 27.5,
  'Barbell Curl': 32.5,
  'Hammer Curl': 16,
  'Skull Crusher': 32.5,
  'Triceps Pushdown': 35,
  'Lateral Raise': 10,
  'Leg Extension': 50,
  'Lying Leg Curl': 45,
  'Barbell Shrug': 90,
  'Neck Flexion': 10,
  'Hip Abduction': 45,
  'Back Extension': 20,
  'Calf Raise': 80,
};

/** Big lifts move slower in percentage terms than small ones. */
const weeklyGain = (exercise: string): number =>
  (STARTING_LOAD[exercise] ?? 40) > 80 ? 0.008 : 0.014;

const plateRound = (load: number): number =>
  load >= 40 ? Math.round(load / 2.5) * 2.5 : Math.round(load);

// Deterministic jitter: the same seed always produces the same history, so
// re-running after a reset gives the same charts.
const noise = (seed: number): number => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const loadFor = (args: {
  exercise: string;
  absoluteWeek: number;
  weekInBlock: number;
  intensity: number;
  seed: number;
}): number => {
  const base = STARTING_LOAD[args.exercise] ?? 40;
  // Gains decay: the same effort buys less after a few months.
  const growth =
    1 + weeklyGain(args.exercise) * args.absoluteWeek * (1 - args.absoluteWeek / 90);
  // Week four is a deload.
  const deload = args.weekInBlock === WEEKS_PER_BLOCK ? 0.85 : 1;
  const jitter = 0.98 + noise(args.seed) * 0.04;
  return plateRound(base * growth * args.intensity * deload * jitter);
};

const handler = async () => {
  const client = new CoreApiClient();

  const { people } = (await client.query({
    people: {
      __args: { filter: { trainingStatus: { is: 'NOT_NULL' } }, first: 1 },
      edges: { node: { id: true, workspaceMemberId: true } },
    },
  } as any)) as any;
  const trainee = people?.edges[0]?.node;
  if (!trainee) {
    console.log('No trainee found — run seed-demo-data first.');
    return {};
  }

  const { programs } = (await client.query({
    programs: {
      __args: { first: 10 },
      edges: { node: { id: true, name: true } },
    },
  } as any)) as any;
  const existing: { id: string; name: string }[] = (programs?.edges ?? []).map(
    (edge: any) => edge.node,
  );
  const source = existing.find((program) => !BLOCKS.some((b) => b.name === program.name));
  if (!source) {
    console.log('No source program to copy the structure from.');
    return {};
  }

  // The prescriptions of the current block are the template for past ones.
  const { workouts } = (await client.query({
    workouts: {
      __args: { filter: { programId: { eq: source.id } }, first: 200 },
      edges: {
        node: {
          id: true,
          day: true,
          week: true,
          name: true,
          programExercises: {
            __args: { first: 100 },
            edges: {
              node: {
                exerciseId: true,
                order: true,
                setScheme: true,
                targetSets: true,
                targetRepsMin: true,
                targetRepsMax: true,
                targetRir: true,
                restSeconds: true,
                exercise: { name: true },
              },
            },
          },
        },
      },
    },
  } as any)) as any;

  const template = (workouts?.edges ?? []).map((edge: any) => edge.node);
  const byDay = new Map<string, any[]>();
  for (const workout of template) {
    if ((workout.week ?? 1) !== 1) {
      continue;
    }
    byDay.set(
      workout.day,
      (workout.programExercises?.edges ?? []).map((edge: any) => edge.node),
    );
  }

  const startOfToday = new Date();
  startOfToday.setHours(18, 0, 0, 0);
  let created = { programs: 0, workouts: 0, prescriptions: 0, sessions: 0, sets: 0 };

  for (const block of BLOCKS) {
    if (existing.some((program) => program.name === block.name)) {
      console.log(`${block.name} already seeded, skipping.`);
      continue;
    }

    const { createProgram } = (await client.mutation({
      createProgram: {
        __args: {
          data: {
            name: block.name,
            status: 'ARCHIVED',
            notes: 'Seeded history — completed block.',
            traineeId: trainee.id,
            traineeMemberId: trainee.workspaceMemberId,
            startedAt: new Date(
              startOfToday.getTime() - block.weeksAgo * 7 * 86400000,
            ).toISOString(),
          },
        },
        id: true,
      },
    } as any)) as any;
    const programId = createProgram.id;
    created.programs++;

    // Workouts, one per day per week, in one call.
    const workoutInputs: any[] = [];
    for (let week = 1; week <= WEEKS_PER_BLOCK; week++) {
      DAYS.forEach((day, dayIndex) => {
        if (!byDay.has(day)) {
          return;
        }
        workoutInputs.push({
          name: `${block.name} W${week} — ${day.replace('DAY_', 'Day ')}`,
          day,
          week,
          order: dayIndex,
          programId,
          traineeMemberId: trainee.workspaceMemberId,
        });
      });
    }
    const { createWorkouts } = (await client.mutation({
      createWorkouts: {
        __args: { data: workoutInputs },
        id: true,
        day: true,
        week: true,
      },
    } as any)) as any;
    created.workouts += createWorkouts.length;

    // Prescriptions: the same movements, this block's rep range.
    const prescriptionInputs: any[] = [];
    for (const workout of createWorkouts) {
      for (const source of byDay.get(workout.day) ?? []) {
        prescriptionInputs.push({
          name: `${source.exercise?.name ?? 'Exercise'} — ${block.name}`,
          order: source.order,
          setScheme: source.setScheme,
          targetSets: source.targetSets,
          targetRepsMin: (source.targetRepsMin ?? 6) + block.repsOffset,
          targetRepsMax: source.targetRepsMax
            ? source.targetRepsMax + block.repsOffset
            : null,
          targetRir: source.targetRir,
          restSeconds: source.restSeconds,
          workoutId: workout.id,
          exerciseId: source.exerciseId,
          traineeMemberId: trainee.workspaceMemberId,
        });
      }
    }
    for (let index = 0; index < prescriptionInputs.length; index += 60) {
      const { createProgramExercises } = (await client.mutation({
        createProgramExercises: {
          __args: { data: prescriptionInputs.slice(index, index + 60) },
          id: true,
          workoutId: true,
          exerciseId: true,
          targetSets: true,
          targetRepsMin: true,
          targetRir: true,
          exercise: { name: true },
        },
      } as any)) as any;
      created.prescriptions += createProgramExercises.length;

      // Sessions and sets for the workouts just filled.
      const prescriptionsByWorkout = new Map<string, any[]>();
      for (const prescription of createProgramExercises) {
        prescriptionsByWorkout.set(prescription.workoutId, [
          ...(prescriptionsByWorkout.get(prescription.workoutId) ?? []),
          prescription,
        ]);
      }

      const setInputs: any[] = [];
      for (const workout of createWorkouts) {
        const prescriptions = prescriptionsByWorkout.get(workout.id) ?? [];
        if (prescriptions.length === 0) {
          continue;
        }
        const week = workout.week ?? 1;
        const dayIndex = DAYS.indexOf(workout.day);
        const daysAgo =
          block.weeksAgo * 7 - (week - 1) * 7 - WEEKDAY_OFFSET[dayIndex];
        const seed = block.weeksAgo * 100 + week * 10 + dayIndex;
        if (noise(seed) < MISSED_SESSION_RATE) {
          continue;
        }

        const startedAt = new Date(startOfToday.getTime() - daysAgo * 86400000);
        startedAt.setHours(17 + Math.floor(noise(seed + 1) * 3), 30, 0, 0);
        const duration = 55 + Math.round(noise(seed + 2) * 35);
        const { createSession } = (await client.mutation({
          createSession: {
            __args: {
              data: {
                name: `${workout.day.replace('DAY_', 'Day ')} — ${startedAt.toISOString().slice(0, 10)}`,
                status: 'COMPLETED',
                day: workout.day,
                week,
                startedAt: startedAt.toISOString(),
                endedAt: new Date(
                  startedAt.getTime() + duration * 60000,
                ).toISOString(),
                createdAt: startedAt.toISOString(),
                durationMinutes: duration,
                programId,
                workoutId: workout.id,
                traineeId: trainee.id,
                traineeMemberId: trainee.workspaceMemberId,
              },
            },
            id: true,
          },
        } as any)) as any;
        created.sessions++;

        let minutesIn = 0;
        prescriptions.forEach((prescription: any, exerciseIndex: number) => {
          const name = prescription.exercise?.name ?? 'Exercise';
          const absoluteWeek = 22 - block.weeksAgo + week;
          const load = loadFor({
            exercise: name,
            absoluteWeek,
            weekInBlock: week,
            intensity: block.intensity,
            seed: seed + exerciseIndex,
          });
          const sets = prescription.targetSets ?? 3;
          for (let setNumber = 1; setNumber <= sets; setNumber++) {
            minutesIn += 3 + Math.round(noise(seed + setNumber) * 2);
            const fatigue = setNumber > 2 && noise(seed + setNumber * 7) > 0.6;
            setInputs.push({
              name: `${name} — set ${setNumber}`,
              setNumber,
              // The last sets of a hard exercise lose a rep or two.
              reps: Math.max(
                1,
                (prescription.targetRepsMin ?? 8) - (fatigue ? 1 : 0),
              ),
              weightKg: load,
              rir: Math.max(0, (prescription.targetRir ?? 2) - (fatigue ? 1 : 0)),
              restSeconds: 90 + Math.round(noise(seed + setNumber * 3) * 90),
              createdAt: new Date(
                startedAt.getTime() + minutesIn * 60000,
              ).toISOString(),
              sessionId: createSession.id,
              programExerciseId: prescription.id,
              exerciseId: prescription.exerciseId,
              programId,
              traineeMemberId: trainee.workspaceMemberId,
            });
          }
        });
      }

      for (let start = 0; start < setInputs.length; start += 60) {
        const { createSetLogs } = (await client.mutation({
          createSetLogs: {
            __args: { data: setInputs.slice(start, start + 60) },
            id: true,
          },
        } as any)) as any;
        created.sets += createSetLogs.length;
      }
    }
  }

  console.log(
    `Seeded ${created.programs} blocks, ${created.workouts} workouts, ${created.prescriptions} prescriptions, ${created.sessions} sessions, ${created.sets} sets.`,
  );
  return {};
};

export default defineLogicFunction({
  universalIdentifier: '2b0f1a6c-6d19-4d33-9a8e-33f5b8c5b8a1',
  name: 'seed-demo-history',
  description:
    'Seeds two completed blocks of training history for the demo trainee (manually triggered, idempotent by program name).',
  timeoutSeconds: 300,
  handler,
});
