import {
  comparePrescriptions,
  compareWorkouts,
  findNextWorkout,
  parseSetScheme,
  parseTrainingDay,
  type SessionCreateInput,
  type SessionUpdateInput,
  type SetLogCreateInput,
  type SetLogUpdateInput,
  type LoggedSet,
  type PrescriptionRow,
  type SessionRow,
  type WorkoutRow,
} from '@coach-twenty/shared';

import { coreClient } from '../lib/coreClient';

export type NextSession = {
  programId: string;
  programName: string;
  workout: WorkoutRow;
  prescriptions: PrescriptionRow[];
  /** Set when a session for this workout is already in progress. */
  openSession: SessionRow | null;
  loggedSets: LoggedSet[];
};

export type ProgramState =
  | { step: 'noProgram' }
  | { step: 'programComplete'; programName: string }
  | { step: 'ready'; next: NextSession };

export type TraineeIds = {
  personId: string | null;
  workspaceMemberId: string | null;
};

/**
 * The trainee's person record, looked up from the signed-in workspace
 * member. Both links are stamped on everything we create: `trainee` for the
 * domain relation, `traineeMember` for the row-level permission predicates.
 *
 * The member id comes from `currentUser` rather than from the first row of
 * `workspaceMembers`: a coach or admin sees every member, so picking the
 * first would attribute their records to somebody else.
 */
export const fetchTraineeIds = async (
  workspaceMemberId: string | null,
): Promise<TraineeIds> => {
  if (!workspaceMemberId) {
    return { personId: null, workspaceMemberId: null };
  }
  const { people } = await coreClient.query({
    people: {
      __args: {
        filter: { workspaceMemberId: { eq: workspaceMemberId } },
        first: 1,
      },
      edges: { node: { id: true } },
    },
  });
  return {
    personId: people?.edges[0]?.node.id ?? null,
    workspaceMemberId,
  };
};

const toWorkoutRow = (node: {
  id: string;
  name?: string;
  day?: string;
  week?: number;
  order?: number;
  notes?: string;
}): WorkoutRow => ({
  id: node.id,
  name: node.name ?? '',
  day: parseTrainingDay(node.day),
  week: node.week ?? null,
  order: node.order ?? null,
  notes: node.notes || null,
});

const toPrescriptionRow = (node: {
  id: string;
  name?: string;
  order?: number;
  setScheme?: string;
  targetSets?: number;
  targetRepsMin?: number;
  targetRepsMax?: number;
  targetWeightKg?: number;
  targetPercent1Rm?: number;
  targetRir?: number;
  restSeconds?: number;
  tempo?: string;
  notes?: string;
  workoutId?: string;
  exercise?: { id: string; name?: string };
}): PrescriptionRow => ({
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
});

export const fetchProgramState = async (): Promise<ProgramState> => {
  const { programs } = await coreClient.query({
    programs: {
      __args: { filter: { status: { eq: 'ACTIVE' } }, first: 1 },
      edges: {
        node: {
          id: true,
          name: true,
          workouts: {
            __args: { first: 100 },
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
        },
      },
    },
  });

  const program = programs?.edges[0]?.node;
  if (!program) {
    return { step: 'noProgram' };
  }

  const workouts = (program.workouts?.edges ?? [])
    .map(({ node }) => toWorkoutRow(node))
    .sort(compareWorkouts);

  // Sessions already finished, plus any session left open mid-workout.
  const { sessions } = await coreClient.query({
    sessions: {
      __args: { filter: { programId: { eq: program.id } }, first: 200 },
      edges: { node: { id: true, status: true, workoutId: true, startedAt: true } },
    },
  });
  const sessionRows: SessionRow[] = (sessions?.edges ?? []).map(({ node }) => ({
    id: node.id,
    status: node.status ?? null,
    workoutId: node.workoutId ?? null,
    startedAt: node.startedAt ?? null,
  }));

  const openSession =
    sessionRows.find((session) => session.status === 'IN_PROGRESS') ?? null;
  const completedWorkoutIds = sessionRows
    .filter((session) => session.status === 'COMPLETED')
    .map((session) => session.workoutId ?? '');

  // An open session wins over program order: finish what was started.
  const workout = openSession
    ? (workouts.find(({ id }) => id === openSession.workoutId) ?? null)
    : findNextWorkout(workouts, completedWorkoutIds);

  if (!workout) {
    return { step: 'programComplete', programName: program.name ?? '' };
  }

  const { programExercises } = await coreClient.query({
    programExercises: {
      __args: { filter: { workoutId: { eq: workout.id } }, first: 100 },
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

  const prescriptions = (programExercises?.edges ?? [])
    .map(({ node }) => toPrescriptionRow(node))
    .sort(comparePrescriptions);

  const loggedSets = openSession ? await fetchLoggedSets(openSession.id) : [];

  return {
    step: 'ready',
    next: {
      programId: program.id,
      programName: program.name ?? '',
      workout,
      prescriptions,
      openSession,
      loggedSets,
    },
  };
};

const SET_LOG_FIELDS = {
  id: true,
  programExerciseId: true,
  setNumber: true,
  reps: true,
  weightKg: true,
  rir: true,
  restSeconds: true,
  comment: true,
  createdAt: true,
} as const;

const toLoggedSet = (node: {
  id: string;
  programExerciseId?: string;
  setNumber?: number;
  reps?: number;
  weightKg?: number;
  rir?: number;
  restSeconds?: number;
  comment?: string;
  createdAt?: string;
}): LoggedSet => ({
  id: node.id,
  programExerciseId: node.programExerciseId ?? null,
  setNumber: node.setNumber ?? null,
  reps: node.reps ?? null,
  weightKg: node.weightKg ?? null,
  rir: node.rir ?? null,
  restSeconds: node.restSeconds ?? null,
  comment: node.comment || null,
  createdAt: node.createdAt ?? null,
});

export const fetchLoggedSets = async (
  sessionId: string,
): Promise<LoggedSet[]> => {
  const { setLogs } = await coreClient.query({
    setLogs: {
      __args: { filter: { sessionId: { eq: sessionId } }, first: 500 },
      edges: { node: SET_LOG_FIELDS },
    },
  });
  return (setLogs?.edges ?? []).map(({ node }) => toLoggedSet(node));
};

/**
 * Last weight lifted per exercise, across every past session. The demo
 * programs prescribe reps and RIR but leave load to the trainee, so this is
 * usually the only expectation there is to offer.
 */
export const fetchLastWeights = async (
  exerciseIds: string[],
): Promise<Map<string, number>> => {
  const ids = exerciseIds.filter(Boolean);
  if (ids.length === 0) {
    return new Map();
  }
  const { setLogs } = await coreClient.query({
    setLogs: {
      __args: {
        filter: { exerciseId: { in: ids } },
        orderBy: [{ createdAt: 'DescNullsLast' }],
        first: 200,
      },
      edges: { node: { exerciseId: true, weightKg: true } },
    },
  });
  const latest = new Map<string, number>();
  for (const { node } of setLogs?.edges ?? []) {
    if (node.exerciseId && node.weightKg != null && !latest.has(node.exerciseId)) {
      latest.set(node.exerciseId, node.weightKg);
    }
  }
  return latest;
};

/**
 * Remote writes used by the sync engine. Values come from the local record,
 * which already carries the client-generated id and timestamp, so a replay
 * after an ambiguous failure lands on the same row.
 */
export const createSessionRemote = async (
  id: string,
  values: SessionCreateInput,
): Promise<void> => {
  await coreClient.mutation({
    createSession: { __args: { data: { ...values, id } }, id: true },
  });
};

export const updateSessionRemote = async (
  id: string,
  values: SessionUpdateInput,
): Promise<void> => {
  await coreClient.mutation({
    updateSession: { __args: { id, data: values }, id: true },
  });
};

export const createSetLogRemote = async (
  id: string,
  values: SetLogCreateInput,
): Promise<void> => {
  await coreClient.mutation({
    createSetLog: { __args: { data: { ...values, id } }, id: true },
  });
};

export const updateSetLogRemote = async (
  id: string,
  values: SetLogUpdateInput,
): Promise<void> => {
  await coreClient.mutation({
    updateSetLog: { __args: { id, data: values }, id: true },
  });
};
