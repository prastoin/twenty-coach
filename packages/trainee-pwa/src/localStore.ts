import {
  withValues,
  type LocalRecord,
  type LocalRecordKind,
  type LoggedSet,
  type PrescriptionRow,
  type SessionRow,
} from '@coach-twenty/shared';

import { allRecords, CACHE, getRecord, putRecord, RECORDS } from './db';
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

const createRecord = (
  kind: LocalRecordKind,
  id: string,
  values: Record<string, unknown>,
): LocalRecord => ({
  id,
  kind,
  values,
  serverKnown: false,
  dirty: true,
  updatedAt: nowIso(),
});

export const recordCreate = (
  kind: LocalRecordKind,
  id: string,
  values: Record<string, unknown>,
): Promise<LocalRecord> => saveRecord(createRecord(kind, id, values));

export const recordEdit = async (
  id: string,
  values: Record<string, unknown>,
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
export const recordKnownEdit = async (
  kind: LocalRecordKind,
  id: string,
  values: Record<string, unknown>,
): Promise<LocalRecord> => {
  const existing = await getRecord<LocalRecord>(RECORDS, id);
  if (existing) {
    return saveRecord(withValues(existing, values, nowIso()));
  }
  return saveRecord({
    id,
    kind,
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

const asNumber = (value: unknown): number | null =>
  typeof value === 'number' ? value : null;

const asString = (value: unknown): string | null =>
  typeof value === 'string' && value !== '' ? value : null;

export const toLoggedSetFromRecord = (record: LocalRecord): LoggedSet => ({
  id: record.id,
  programExerciseId: asString(record.values.programExerciseId),
  setNumber: asNumber(record.values.setNumber),
  reps: asNumber(record.values.reps),
  weightKg: asNumber(record.values.weightKg),
  rir: asNumber(record.values.rir),
  restSeconds: asNumber(record.values.restSeconds),
  comment: asString(record.values.comment),
  createdAt: asString(record.values.createdAt),
});

/** Local writes win: they are newer than anything the server returned. */
export const overlaySets = (
  fromServer: LoggedSet[],
  records: LocalRecord[],
  sessionId: string,
): LoggedSet[] => {
  const local = records.filter(
    (record) =>
      record.kind === 'setLog' && record.values.sessionId === sessionId,
  );
  const byId = new Map(fromServer.map((set) => [set.id, set]));
  for (const record of local) {
    byId.set(record.id, toLoggedSetFromRecord(record));
  }
  return [...byId.values()];
};

/** A session started on this device that the server has not confirmed yet. */
export const localOpenSession = (records: LocalRecord[]): SessionRow | null => {
  const record = records.find(
    (candidate) =>
      candidate.kind === 'session' && candidate.values.status === 'IN_PROGRESS',
  );
  return record
    ? {
        id: record.id,
        status: 'IN_PROGRESS',
        workoutId: asString(record.values.workoutId),
        startedAt: asString(record.values.startedAt),
      }
    : null;
};

export const localCompletedWorkoutIds = (records: LocalRecord[]): string[] =>
  records
    .filter(
      (record) =>
        record.kind === 'session' && record.values.status === 'COMPLETED',
    )
    .map((record) => asString(record.values.workoutId) ?? '')
    .filter(Boolean);

export const prescriptionSetCount = (
  prescriptions: PrescriptionRow[],
): number =>
  prescriptions.reduce(
    (total, prescription) => total + (prescription.targetSets ?? 0),
    0,
  );
