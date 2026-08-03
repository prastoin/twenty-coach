import {
  withValues,
  type LocalRecord,
  type LocalSessionRecord,
  type LocalSetLogRecord,
  type LoggedSet,
  type SessionCreateInput,
  type SetLogCreateInput,
  type PrescriptionRow,
  type SessionRow,
} from '@coach-twenty/shared';

import { allRecords, CACHE, getRecord, putRecord, RECORDS } from '../lib/db';
import type { ProgramState } from './session';

const PROGRAM_STATE_KEY = 'programState';

export const newId = (): string => crypto.randomUUID();

const nowIso = (): string => new Date().toISOString();

export const loadRecords = (): Promise<LocalRecord[]> =>
  allRecords<LocalRecord>(RECORDS);

export const saveRecord = async (record: LocalRecord): Promise<LocalRecord> => {
  await putRecord(RECORDS, record);
  return record;
};

export const recordSessionCreate = (
  id: string,
  values: SessionCreateInput,
): Promise<LocalRecord> =>
  saveRecord({
    id,
    kind: 'session',
    values,
    serverKnown: false,
    dirty: true,
    updatedAt: nowIso(),
  });

export const recordSetLogCreate = (
  id: string,
  values: SetLogCreateInput,
): Promise<LocalRecord> =>
  saveRecord({
    id,
    kind: 'setLog',
    values,
    serverKnown: false,
    dirty: true,
    updatedAt: nowIso(),
  });

export const recordEdit = async (
  id: string,
  values: Partial<LocalRecord['values']>,
): Promise<LocalRecord | null> => {
  const existing = await getRecord<LocalRecord>(RECORDS, id);
  if (!existing) {
    return null;
  }
  return saveRecord(withValues(existing, values, nowIso()));
};

/**
 * An edit to a record the server already returned — it was created before
 * this device had a local copy, so the local record starts as already known
 * to the server and only carries the change.
 */
const knownEdit = async (
  record: LocalRecord,
): Promise<LocalRecord> => saveRecord(record);

/**
 * An edit to a record the server already returned — it was created before
 * this device had a local copy, so the local record starts as already known
 * to the server and only carries the change.
 */
export const recordKnownSessionEdit = async (
  id: string,
  values: Partial<SessionCreateInput>,
): Promise<LocalRecord> => {
  const existing = await getRecord<LocalRecord>(RECORDS, id);
  return existing
    ? saveRecord(withValues(existing, values, nowIso()))
    : knownEdit({
        id,
        kind: 'session',
        values,
        serverKnown: true,
        dirty: true,
        updatedAt: nowIso(),
      });
};

export const recordKnownSetLogEdit = async (
  id: string,
  values: Partial<SetLogCreateInput>,
): Promise<LocalRecord> => {
  const existing = await getRecord<LocalRecord>(RECORDS, id);
  return existing
    ? saveRecord(withValues(existing, values, nowIso()))
    : knownEdit({
        id,
        kind: 'setLog',
        values,
        serverKnown: true,
        dirty: true,
        updatedAt: nowIso(),
      });
};

export const markSynced = async (record: LocalRecord): Promise<void> => {
  const current = await getRecord<LocalRecord>(RECORDS, record.id);
  if (!current) {
    return;
  }
  // Anything written while the request was in flight stays dirty.
  await saveRecord({
    ...current,
    serverKnown: true,
    dirty: current.updatedAt !== record.updatedAt,
  });
};

export const cacheProgramState = (state: ProgramState): Promise<unknown> =>
  putRecord(CACHE, state, PROGRAM_STATE_KEY);

export const cachedProgramState = (): Promise<ProgramState | undefined> =>
  getRecord<ProgramState>(CACHE, PROGRAM_STATE_KEY);

const sessionRecords = (records: LocalRecord[]): LocalSessionRecord[] =>
  records.filter(
    (record): record is LocalSessionRecord => record.kind === 'session',
  );

const setLogRecords = (records: LocalRecord[]): LocalSetLogRecord[] =>
  records.filter(
    (record): record is LocalSetLogRecord => record.kind === 'setLog',
  );

export const toLoggedSetFromRecord = (record: LocalSetLogRecord): LoggedSet => ({
  id: record.id,
  programExerciseId: record.values.programExerciseId ?? null,
  setNumber: record.values.setNumber ?? null,
  reps: record.values.reps ?? null,
  weightKg: record.values.weightKg ?? null,
  rir: record.values.rir ?? null,
  restSeconds: record.values.restSeconds ?? null,
  comment: record.values.comment || null,
  createdAt: record.values.createdAt ?? null,
});

/** Local writes win: they are newer than anything the server returned. */
export const overlaySets = (
  fromServer: LoggedSet[],
  records: LocalRecord[],
  sessionId: string,
): LoggedSet[] => {
  const local = setLogRecords(records).filter(
    (record) => record.values.sessionId === sessionId,
  );
  const byId = new Map(fromServer.map((set) => [set.id, set]));
  for (const record of local) {
    byId.set(record.id, toLoggedSetFromRecord(record));
  }
  return [...byId.values()];
};

/** A session started on this device that the server has not confirmed yet. */
export const localOpenSession = (records: LocalRecord[]): SessionRow | null => {
  const record = sessionRecords(records).find(
    (candidate) => candidate.values.status === 'IN_PROGRESS',
  );
  return record
    ? {
        id: record.id,
        status: 'IN_PROGRESS',
        workoutId: record.values.workoutId ?? null,
        startedAt: record.values.startedAt ?? null,
      }
    : null;
};

export const localCompletedWorkoutIds = (records: LocalRecord[]): string[] =>
  sessionRecords(records)
    .filter((record) => record.values.status === 'COMPLETED')
    .map((record) => record.values.workoutId ?? '')
    .filter(Boolean);

export const prescriptionSetCount = (
  prescriptions: PrescriptionRow[],
): number =>
  prescriptions.reduce(
    (total, prescription) => total + (prescription.targetSets ?? 0),
    0,
  );
