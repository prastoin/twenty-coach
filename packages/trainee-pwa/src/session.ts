import {
  comparePrescriptions,
  compareWorkouts,
  findNextWorkout,
  parseSetScheme,
  parseTrainingDay,
  sessionName,
  setLogName,
  durationMinutes,
  type LoggedSet,
  type PrescriptionRow,
  type SessionRow,
  type WorkoutRow,
} from '@coach-twenty/shared';

import { coreClient } from './client';

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

/**
 * The trainee's own person record, found through the workspace member the
 * OAuth token belongs to. Both links are stamped on everything we create:
 * `trainee` for the domain relation, `traineeMember` for the row-level
 * permission predicates.
 */
export const fetchTraineeIds = async (): Promise<{
  personId: string | null;
  workspaceMemberId: string | null;
}> => {
  const { workspaceMembers } = await coreClient.query({
    workspaceMembers: {
      __args: { first: 1 },
      edges: { node: { id: true, trainees: { edges: { node: { id: true } } } } },
    },
  });
  const member = workspaceMembers?.edges[0]?.node;
  return {
    personId: member?.trainees?.edges[0]?.node.id ?? null,
    workspaceMemberId: member?.id ?? null,
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

  const prescriptions: PrescriptionRow[] = (programExercises?.edges ?? [])
    .map(({ node }) => ({
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
    }))
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

export const startSession = async (
  next: NextSession,
  trainee: { personId: string | null; workspaceMemberId: string | null },
): Promise<SessionRow> => {
  const startedAt = new Date();
  const { createSession } = await coreClient.mutation({
    createSession: {
      __args: {
        data: {
          name: sessionName(next.workout, startedAt),
          status: 'IN_PROGRESS',
          startedAt: startedAt.toISOString(),
          day: next.workout.day,
          week: next.workout.week,
          programId: next.programId,
          workoutId: next.workout.id,
          ...(trainee.personId ? { traineeId: trainee.personId } : {}),
          ...(trainee.workspaceMemberId
            ? { traineeMemberId: trainee.workspaceMemberId }
            : {}),
        },
      },
      id: true,
      status: true,
      workoutId: true,
      startedAt: true,
    },
  });
  if (!createSession) {
    throw new Error('Session could not be created');
  }
  return {
    id: createSession.id,
    status: createSession.status ?? null,
    workoutId: createSession.workoutId ?? null,
    startedAt: createSession.startedAt ?? null,
  };
};

export const logSet = async (args: {
  sessionId: string;
  prescription: PrescriptionRow;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  rir: number | null;
  restSeconds: number | null;
  comment: string | null;
  traineeMemberId: string | null;
}): Promise<LoggedSet> => {
  const { createSetLog } = await coreClient.mutation({
    createSetLog: {
      __args: {
        data: {
          name: setLogName(args.prescription, args.setNumber),
          setNumber: args.setNumber,
          reps: args.reps,
          weightKg: args.weightKg,
          rir: args.rir,
          restSeconds: args.restSeconds,
          comment: args.comment,
          sessionId: args.sessionId,
          programExerciseId: args.prescription.id,
          ...(args.prescription.exerciseId
            ? { exerciseId: args.prescription.exerciseId }
            : {}),
          ...(args.traineeMemberId
            ? { traineeMemberId: args.traineeMemberId }
            : {}),
        },
      },
      ...SET_LOG_FIELDS,
    },
  });
  if (!createSetLog) {
    throw new Error('Set could not be saved');
  }
  return toLoggedSet(createSetLog);
};

export const updateSet = async (args: {
  id: string;
  reps: number | null;
  weightKg: number | null;
  rir: number | null;
  restSeconds: number | null;
  comment: string | null;
}): Promise<LoggedSet> => {
  const { updateSetLog } = await coreClient.mutation({
    updateSetLog: {
      __args: {
        id: args.id,
        data: {
          reps: args.reps,
          weightKg: args.weightKg,
          rir: args.rir,
          restSeconds: args.restSeconds,
          comment: args.comment,
        },
      },
      ...SET_LOG_FIELDS,
    },
  });
  if (!updateSetLog) {
    throw new Error('Set could not be updated');
  }
  return toLoggedSet(updateSetLog);
};

export const finishSession = async (session: SessionRow): Promise<void> => {
  const endedAt = new Date();
  await coreClient.mutation({
    updateSession: {
      __args: {
        id: session.id,
        data: {
          status: 'COMPLETED',
          endedAt: endedAt.toISOString(),
          ...(session.startedAt
            ? { durationMinutes: durationMinutes(session.startedAt, endedAt) }
            : {}),
        },
      },
      id: true,
    },
  });
};
