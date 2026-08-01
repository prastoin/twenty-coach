import {
  comparePrescriptions,
  compareWorkouts,
  type PrescriptionRow,
  type WorkoutRow,
} from '@coach-twenty/shared';

import { graphqlRequest } from './graphql';

export type ActiveProgram = {
  id: string;
  name: string;
  notes: string | null;
  workouts: WorkoutRow[];
  prescriptionsByWorkout: Map<string, PrescriptionRow[]>;
};

const ACTIVE_PROGRAM_QUERY = `
  { programs(filter: { status: { eq: ACTIVE } }, first: 1) {
      edges { node { id name notes } } } }`;

const WORKOUTS_QUERY = `
  query Workouts($programId: UUID) {
    workouts(filter: { programId: { eq: $programId } }, first: 100) {
      edges { node { id name day week order notes } } } }`;

const PRESCRIPTIONS_QUERY = `
  query Prescriptions($workoutIds: [UUID!]) {
    programExercises(filter: { workoutId: { in: $workoutIds } }, first: 500) {
      edges { node {
        id name order setScheme targetSets targetRepsMin targetRepsMax
        targetWeightKg targetPercent1Rm targetRir restSeconds tempo notes
        workoutId exercise { id name } } } } }`;

type Edges<T> = { edges: { node: T }[] };

export const fetchActiveProgram = async (): Promise<ActiveProgram | null> => {
  const programData = await graphqlRequest<{ programs: Edges<any> }>(
    '/graphql',
    ACTIVE_PROGRAM_QUERY,
  );
  const program = programData.programs.edges[0]?.node;
  if (!program) {
    return null;
  }

  const workoutData = await graphqlRequest<{ workouts: Edges<any> }>(
    '/graphql',
    WORKOUTS_QUERY,
    { programId: program.id },
  );
  const workouts: WorkoutRow[] = workoutData.workouts.edges
    .map(({ node }) => ({
      id: node.id,
      name: node.name ?? '',
      day: node.day ?? null,
      week: node.week ?? null,
      order: node.order ?? null,
      notes: node.notes || null,
    }))
    .sort(compareWorkouts);

  const prescriptionsByWorkout = new Map<string, PrescriptionRow[]>();
  if (workouts.length > 0) {
    const prescriptionData = await graphqlRequest<{
      programExercises: Edges<any>;
    }>('/graphql', PRESCRIPTIONS_QUERY, {
      workoutIds: workouts.map((workout) => workout.id),
    });
    for (const { node } of prescriptionData.programExercises.edges) {
      const row: PrescriptionRow = {
        id: node.id,
        name: node.name ?? '',
        exerciseId: node.exercise?.id ?? null,
        order: node.order ?? null,
        setScheme: node.setScheme ?? null,
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
  }

  return {
    id: program.id,
    name: program.name ?? '',
    notes: program.notes || null,
    workouts,
    prescriptionsByWorkout,
  };
};
