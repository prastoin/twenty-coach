import {
  comparePrescriptions,
  compareWorkouts,
  parseSetScheme,
  parseTrainingDay,
  type PrescriptionRow,
  type WorkoutRow,
} from '@coach-twenty/shared';

import { coreClient } from './client';

export type ActiveProgram = {
  id: string;
  name: string;
  notes: string | null;
  workouts: WorkoutRow[];
  prescriptionsByWorkout: Map<string, PrescriptionRow[]>;
};

// No trainee filter anywhere: row-level permissions scope every query to the
// signed-in trainee's own records.
export const fetchActiveProgram = async (): Promise<ActiveProgram | null> => {
  const { programs } = await coreClient.query({
    programs: {
      __args: { filter: { status: { eq: 'ACTIVE' } }, first: 1 },
      edges: { node: { id: true, name: true, notes: true } },
    },
  });

  const program = programs?.edges[0]?.node;
  if (!program) {
    return null;
  }

  const { workouts: workoutConnection } = await coreClient.query({
    workouts: {
      __args: { filter: { programId: { eq: program.id } }, first: 100 },
      edges: {
        node: {
          id: true,
          name: true,
          day: true,
          week: true,
          order: true,
          notes: true,
        },
      },
    },
  });

  const workouts: WorkoutRow[] = (workoutConnection?.edges ?? [])
    .map(({ node }) => ({
      id: node.id,
      name: node.name ?? '',
      day: parseTrainingDay(node.day),
      week: node.week ?? null,
      order: node.order ?? null,
      notes: node.notes || null,
    }))
    .sort(compareWorkouts);

  const prescriptionsByWorkout = new Map<string, PrescriptionRow[]>();
  const summary = {
    id: program.id,
    name: program.name ?? '',
    notes: program.notes || null,
    workouts,
    prescriptionsByWorkout,
  };
  if (workouts.length === 0) {
    return summary;
  }

  const { programExercises } = await coreClient.query({
    programExercises: {
      __args: {
        filter: { workoutId: { in: workouts.map((workout) => workout.id) } },
        first: 500,
      },
      edges: {
        node: {
          id: true,
          name: true,
          order: true,
          setScheme: true,
          targetSets: true,
          targetRepsMin: true,
          targetRepsMax: true,
          targetWeightKg: true,
          targetPercent1Rm: true,
          targetRir: true,
          restSeconds: true,
          tempo: true,
          notes: true,
          workoutId: true,
          exercise: { id: true, name: true },
        },
      },
    },
  });

  for (const { node } of programExercises?.edges ?? []) {
    const row: PrescriptionRow = {
      id: node.id,
      name: node.name ?? '',
      exerciseId: node.exercise?.id ?? null,
      order: node.order ?? null,
      setScheme: parseSetScheme(node.setScheme),
      targetSets: node.targetSets ?? null,
      targetRepsMin: node.targetRepsMin ?? null,
      targetRepsMax: node.targetRepsMax ?? null,
      targetWeightKg: node.targetWeightKg ?? null,
      targetPercent1Rm: node.targetPercent1Rm ?? null,
      targetRir: node.targetRir ?? null,
      restSeconds: node.restSeconds ?? null,
      tempo: node.tempo || null,
      notes: node.notes || null,
      exerciseName: node.exercise?.name ?? null,
      workoutId: node.workoutId ?? null,
    };
    const list = prescriptionsByWorkout.get(row.workoutId ?? '') ?? [];
    list.push(row);
    prescriptionsByWorkout.set(row.workoutId ?? '', list);
  }
  for (const list of prescriptionsByWorkout.values()) {
    list.sort(comparePrescriptions);
  }

  return summary;
};
