import {
  sessionName,
  setLogName,
  durationMinutes,
  type SessionCreateInput,
  type LoggedSet,
  type PrescriptionRow,
  type SessionRow,
} from '@coach-twenty/shared';

import {
  cachedProgramState,
  cachedTraineeIds,
  cacheProgramState,
  cacheTraineeIds,
  loadRecords,
  localCompletedWorkoutIds,
  localOpenSession,
  newId,
  overlaySets,
  recordKnownSessionEdit,
  recordKnownSetLogEdit,
  recordSessionCreate,
  recordSetLogCreate,
  recordEdit,
} from './localStore';
import {
  fetchLastWeights,
  fetchProgramState,
  fetchTraineeIds,
  type NextSession,
  type ProgramState,
  type TraineeIds,
} from './session';
import { fetchCurrentUser } from './user';
import { flush } from './sync';

export type TrainingView = {
  state: ProgramState;
  lastWeights: Map<string, number>;
  /** True when the content came from cache because the network failed. */
  offline: boolean;
  /** Offline with the cached workout already finished on this device. */
  awaitingSync: boolean;
};

/**
 * The training view, local-first: the server is asked, and whatever the
 * trainee has logged on this device is laid over the answer. With no
 * network, the last cached answer is used instead — so the app opens on the
 * right session in a basement.
 */
export const loadTrainingView = async (): Promise<TrainingView> => {
  const records = await loadRecords();
  let offline = false;
  let state: ProgramState | undefined;
  let lastWeights = new Map<string, number>();

  try {
    state = await fetchProgramState();
    await cacheProgramState(state);
    if (state.step === 'ready') {
      lastWeights = await fetchLastWeights(
        state.next.prescriptions
          .map((prescription) => prescription.exerciseId)
          .filter((id): id is string => Boolean(id)),
      );
    }
  } catch {
    offline = true;
    state = await cachedProgramState();
  }

  if (!state) {
    throw new Error('No connection, and nothing saved on this device yet');
  }
  if (state.step !== 'ready') {
    return { state, lastWeights, offline, awaitingSync: false };
  }

  // Which workout comes after the cached one is only known once the server
  // answers again, so offline the app says so rather than guessing.
  const finishedLocally = localCompletedWorkoutIds(records).includes(
    state.next.workout.id,
  );
  if (offline && finishedLocally) {
    return { state, lastWeights, offline, awaitingSync: true };
  }

  // A session started offline is absent from the server's answer.
  const openSession = finishedLocally
    ? null
    : (state.next.openSession ?? localOpenSession(records));

  const next: NextSession = openSession
    ? {
        ...state.next,
        openSession,
        loggedSets: overlaySets(state.next.loggedSets, records, openSession.id),
      }
    : { ...state.next, openSession: null, loggedSets: [] };

  return {
    state: { step: 'ready', next },
    lastWeights,
    offline,
    awaitingSync: false,
  };
};

/**
 * Who the records belong to, from the network when it answers and from the
 * device otherwise — a session logged offline still has to be attributable.
 */
export const resolveTraineeIds = async (): Promise<TraineeIds> => {
  try {
    const user = await fetchCurrentUser();
    const ids = await fetchTraineeIds(user.workspaceMemberId);
    await cacheTraineeIds(ids);
    return ids;
  } catch {
    return (
      (await cachedTraineeIds()) ?? { personId: null, workspaceMemberId: null }
    );
  }
};

export const startSessionLocally = async (
  next: NextSession,
  trainee: TraineeIds,
): Promise<SessionRow> => {
  const startedAt = new Date();
  const id = newId();
  await recordSessionCreate(id, {
    name: sessionName(next.workout, startedAt),
    status: 'IN_PROGRESS',
    startedAt: startedAt.toISOString(),
    createdAt: startedAt.toISOString(),
    day: next.workout.day,
    week: next.workout.week,
    programId: next.programId,
    workoutId: next.workout.id,
    ...(trainee.personId ? { traineeId: trainee.personId } : {}),
    ...(trainee.workspaceMemberId
      ? { traineeMemberId: trainee.workspaceMemberId }
      : {}),
  });
  void flush();
  return {
    id,
    status: 'IN_PROGRESS',
    workoutId: next.workout.id,
    startedAt: startedAt.toISOString(),
  };
};

export const logSetLocally = async (args: {
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
  const loggedAt = new Date().toISOString();
  const id = newId();
  await recordSetLogCreate(id, {
    name: setLogName(args.prescription, args.setNumber),
    setNumber: args.setNumber,
    reps: args.reps,
    weightKg: args.weightKg,
    rir: args.rir,
    restSeconds: args.restSeconds,
    comment: args.comment,
    // The device stamps when the set happened, so rest between sets stays
    // accurate even if the write reaches the server an hour later.
    createdAt: loggedAt,
    sessionId: args.sessionId,
    programExerciseId: args.prescription.id,
    ...(args.prescription.exerciseId
      ? { exerciseId: args.prescription.exerciseId }
      : {}),
    ...(args.traineeMemberId
      ? { traineeMemberId: args.traineeMemberId }
      : {}),
  });
  void flush();
  return {
    id,
    programExerciseId: args.prescription.id,
    setNumber: args.setNumber,
    reps: args.reps,
    weightKg: args.weightKg,
    rir: args.rir,
    restSeconds: args.restSeconds,
    comment: args.comment,
    createdAt: loggedAt,
  };
};

export const editSetLocally = async (
  setId: string,
  values: {
    reps: number | null;
    weightKg: number | null;
    rir: number | null;
    restSeconds: number | null;
    comment: string | null;
  },
  existing: LoggedSet,
): Promise<LoggedSet> => {
  // An edit before the create has synced merges into it; an edit to a set
  // the server already has becomes an update.
  const record =
    (await recordEdit(setId, values)) ??
    (await recordKnownSetLogEdit(setId, values));
  void flush();
  return { ...existing, ...values, id: record.id };
};

export const finishSessionLocally = async (
  session: SessionRow,
): Promise<void> => {
  const endedAt = new Date();
  const values: Partial<SessionCreateInput> = {
    status: 'COMPLETED',
    endedAt: endedAt.toISOString(),
    ...(session.startedAt
      ? { durationMinutes: durationMinutes(session.startedAt, endedAt) }
      : {}),
  };
  const edited = await recordEdit(session.id, values);
  if (!edited) {
    await recordKnownSessionEdit(session.id, values);
  }
  void flush();
};
