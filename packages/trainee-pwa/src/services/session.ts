import {
  comparePrescriptions,
  compareWorkouts,
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

/**
 * Everything about the active program the app needs to run without a
 * network: every workout and its prescriptions, the sessions already
 * recorded, and the loads last used. Which session comes next is derived
 * from this on the device, so a trainee can finish one session and start
 * the following one with no signal in between.
 */
export type ProgramSnapshot = {
  id: string;
  name: string;
  workouts: WorkoutRow[];
  prescriptionsByWorkout: Record<string, PrescriptionRow[]>;
  sessions: SessionRow[];
  loggedSetsBySession: Record<string, LoggedSet[]>;
  lastWeightByExercise: Record<string, number>;
};

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

const PRESCRIPTION_FIELDS = {
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
} as const;

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

export const fetchProgramSnapshot =
  async (): Promise<ProgramSnapshot | null> => {
    const { programs } = await coreClient.query({
      programs: {
        __args: { filter: { status: { eq: 'ACTIVE' } }, first: 1 },
        edges: {
          node: {
            id: true,
            name: true,
            workouts: {
              __args: { first: 200 },
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
      return null;
    }

    const workouts = (program.workouts?.edges ?? [])
      .map(({ node }) => toWorkoutRow(node))
      .sort(compareWorkouts);

    const [{ programExercises }, { sessions }] = await Promise.all([
      coreClient.query({
        programExercises: {
          __args: {
            filter: { workoutId: { in: workouts.map(({ id }) => id) } },
            first: 1000,
          },
          edges: { node: PRESCRIPTION_FIELDS },
        },
      }),
      coreClient.query({
        sessions: {
          __args: { filter: { programId: { eq: program.id } }, first: 200 },
          edges: {
            node: { id: true, status: true, workoutId: true, startedAt: true },
          },
        },
      }),
    ]);

    const prescriptionsByWorkout: Record<string, PrescriptionRow[]> = {};
    for (const { node } of programExercises?.edges ?? []) {
      const row = toPrescriptionRow(node);
      const key = row.workoutId ?? '';
      (prescriptionsByWorkout[key] ??= []).push(row);
    }
    for (const rows of Object.values(prescriptionsByWorkout)) {
      rows.sort(comparePrescriptions);
    }

    const sessionRows: SessionRow[] = (sessions?.edges ?? []).map(
      ({ node }) => ({
        id: node.id,
        status: node.status ?? null,
        workoutId: node.workoutId ?? null,
        startedAt: node.startedAt ?? null,
      }),
    );

    const openSession = sessionRows.find(
      (session) => session.status === 'IN_PROGRESS',
    );
    const loggedSetsBySession: Record<string, LoggedSet[]> = openSession
      ? { [openSession.id]: await fetchLoggedSets(openSession.id) }
      : {};

    const exerciseIds = Object.values(prescriptionsByWorkout)
      .flat()
      .map((prescription) => prescription.exerciseId)
      .filter((id): id is string => Boolean(id));

    return {
      id: program.id,
      name: program.name ?? '',
      workouts,
      prescriptionsByWorkout,
      sessions: sessionRows,
      loggedSetsBySession,
      lastWeightByExercise: Object.fromEntries(
        await fetchLastWeights([...new Set(exerciseIds)]),
      ),
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
