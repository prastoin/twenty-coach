// The session side of the domain: which workout comes next, and how far
// through it the trainee is. Pure functions over rows — no transport.

import type { Session } from './generated/client/schema';
import { compareWorkouts, type PrescriptionRow, type WorkoutRow } from './training';

export type SessionStatus = NonNullable<Session['status']>;

export type SessionRow = {
  id: string;
  status: SessionStatus | null;
  workoutId: string | null;
  startedAt: string | null;
};

export type LoggedSet = {
  id: string;
  programExerciseId: string | null;
  setNumber: number | null;
};

/**
 * The workout to train next: the first one in program order without a
 * completed session. Progress-based rather than date-based, so a missed
 * day stays next instead of being silently skipped.
 */
export const findNextWorkout = (
  workouts: WorkoutRow[],
  completedWorkoutIds: Iterable<string>,
): WorkoutRow | null => {
  const done = new Set(completedWorkoutIds);
  return (
    [...workouts].sort(compareWorkouts).find(({ id }) => !done.has(id)) ?? null
  );
};

/** Sets already logged for a prescription, in order. */
export const setsForPrescription = (
  logs: LoggedSet[],
  prescriptionId: string,
): LoggedSet[] =>
  logs
    .filter((log) => log.programExerciseId === prescriptionId)
    .sort((a, b) => (a.setNumber ?? 0) - (b.setNumber ?? 0));

/** 1-based number for the next set of a prescription. */
export const nextSetNumber = (
  logs: LoggedSet[],
  prescriptionId: string,
): number => setsForPrescription(logs, prescriptionId).length + 1;

export const isPrescriptionComplete = (
  logs: LoggedSet[],
  prescription: PrescriptionRow,
): boolean =>
  prescription.targetSets !== null &&
  setsForPrescription(logs, prescription.id).length >= prescription.targetSets;

export const sessionProgress = (
  logs: LoggedSet[],
  prescriptions: PrescriptionRow[],
): { done: number; total: number } => ({
  done: logs.length,
  total: prescriptions.reduce(
    (total, prescription) => total + (prescription.targetSets ?? 0),
    0,
  ),
});

/** Name given to a session, e.g. "Day A — 2026-08-01". */
export const sessionName = (workout: WorkoutRow, startedAt: Date): string =>
  `${workout.name} — ${startedAt.toISOString().slice(0, 10)}`;

/** Set label, e.g. "Back Squat — set 3". */
export const setLogName = (
  prescription: PrescriptionRow,
  setNumber: number,
): string =>
  `${prescription.exerciseName ?? prescription.name} — set ${setNumber}`;

export const durationMinutes = (startedAt: string, endedAt: Date): number =>
  Math.max(
    1,
    Math.round((endedAt.getTime() - new Date(startedAt).getTime()) / 60000),
  );
