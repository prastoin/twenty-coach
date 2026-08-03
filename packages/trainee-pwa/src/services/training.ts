import {
  durationMinutes,
  findNextWorkout,
  sessionName,
  setLogName,
  type LoggedSet,
  type PrescriptionRow,
  type SessionCreateInput,
  type SessionRow,
  type WorkoutRow,
} from '@coach-twenty/shared';

import {
  cachedProgramSnapshot,
  cachedTraineeIds,
  cacheProgramSnapshot,
  cacheTraineeIds,
  loadRecords,
  localCompletedWorkoutIds,
  localOpenSession,
  newId,
  overlaySets,
  recordEdit,
  recordKnownSessionEdit,
  recordKnownSetLogEdit,
  recordSessionCreate,
  recordSetLogCreate,
} from './localStore';
import {
  fetchProgramSnapshot,
  fetchTraineeIds,
  type ProgramSnapshot,
  type TraineeIds,
} from './session';
import { flush } from './sync';
import { fetchCurrentUser } from './user';

export type TrainingView =
  | { step: 'noProgram'; offline: boolean }
  | { step: 'programComplete'; programName: string; offline: boolean }
  | {
      step: 'ready';
      offline: boolean;
      programId: string;
      programName: string;
      workout: WorkoutRow;
      prescriptions: PrescriptionRow[];
      openSession: SessionRow | null;
      loggedSets: LoggedSet[];
      lastWeights: Map<string, number>;
    };

/**
 * The training view, local-first. The whole program is cached, so which
 * session comes next is worked out on the device from what has been
 * completed — the same computation with or without a network, which is what
 * lets a trainee finish one session and start the next with no signal in
 * between.
 */
export const loadTrainingView = async (): Promise<TrainingView> => {
  const records = await loadRecords();
  let offline = false;
  let snapshot: ProgramSnapshot | null | undefined;

  try {
    snapshot = await fetchProgramSnapshot();
    if (snapshot) {
      await cacheProgramSnapshot(snapshot);
    }
  } catch {
    offline = true;
    snapshot = await cachedProgramSnapshot();
  }

  if (!snapshot) {
    if (offline) {
      throw new Error('No connection, and nothing saved on this device yet');
    }
    return { step: 'noProgram', offline };
  }

  const completed = [
    ...snapshot.sessions
      .filter((session) => session.status === 'COMPLETED')
      .map((session) => session.workoutId ?? ''),
    ...localCompletedWorkoutIds(records),
  ].filter(Boolean);

  // A session started on this device may not have reached the server yet.
  const openSession =
    localOpenSession(records) ??
    snapshot.sessions.find((session) => session.status === 'IN_PROGRESS') ??
    null;

  const workout = openSession
    ? (snapshot.workouts.find(({ id }) => id === openSession.workoutId) ?? null)
    : findNextWorkout(snapshot.workouts, completed);

  if (!workout) {
    return { step: 'programComplete', programName: snapshot.name, offline };
  }

  return {
    step: 'ready',
    offline,
    programId: snapshot.id,
    programName: snapshot.name,
    workout,
    prescriptions: snapshot.prescriptionsByWorkout[workout.id] ?? [],
    openSession,
    loggedSets: openSession
      ? overlaySets(
          snapshot.loggedSetsBySession[openSession.id] ?? [],
          records,
          openSession.id,
        )
      : [],
    lastWeights: new Map(Object.entries(snapshot.lastWeightByExercise)),
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
  program: { id: string; workout: WorkoutRow },
  trainee: TraineeIds,
): Promise<SessionRow> => {
  const startedAt = new Date();
  const id = newId();
  await recordSessionCreate(id, {
    name: sessionName(program.workout, startedAt),
    status: 'IN_PROGRESS',
    startedAt: startedAt.toISOString(),
    createdAt: startedAt.toISOString(),
    day: program.workout.day,
    week: program.workout.week,
    programId: program.id,
    workoutId: program.workout.id,
    ...(trainee.personId ? { traineeId: trainee.personId } : {}),
    ...(trainee.workspaceMemberId
      ? { traineeMemberId: trainee.workspaceMemberId }
      : {}),
  });
  void flush();
  return {
    id,
    status: 'IN_PROGRESS',
    workoutId: program.workout.id,
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
    ...(args.traineeMemberId ? { traineeMemberId: args.traineeMemberId } : {}),
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
