// Local-first sync rules. The device holds the authoritative copy of what
// the trainee logged; the server is caught up afterwards.
//
// Records are queued, not mutations: each dirty record flushes once with its
// current values — as a create if the server has never seen it, otherwise as
// an update. Editing a set that has not synced yet therefore stays a single
// create rather than a create followed by an update.
//
// Last-write-wins is correct rather than a compromise here: a record has one
// writer, the trainee's own device during their own session.

import type {
  SessionCreateInput,
  SessionUpdateInput,
  SetLogCreateInput,
  SetLogUpdateInput,
} from './generated/client/schema';

export type {
  SessionCreateInput,
  SessionUpdateInput,
  SetLogCreateInput,
  SetLogUpdateInput,
};

type RecordBase = {
  /** Generated on the device, so replay after an ambiguous failure is idempotent. */
  id: string;
  /** Whether a create for this record has been acknowledged by the server. */
  serverKnown: boolean;
  /** Whether the local values are ahead of the server. */
  dirty: boolean;
  /** Device clock, not the server's — the moment the trainee acted. */
  updatedAt: string;
};

/** Values are the API's own create inputs, so a typo cannot reach the queue. */
export type LocalSessionRecord = RecordBase & {
  kind: 'session';
  values: SessionCreateInput;
};

export type LocalSetLogRecord = RecordBase & {
  kind: 'setLog';
  values: SetLogCreateInput;
};

export type LocalRecord = LocalSessionRecord | LocalSetLogRecord;
export type LocalRecordKind = LocalRecord['kind'];

export type LocalValues<K extends LocalRecordKind> = K extends 'session'
  ? SessionCreateInput
  : SetLogCreateInput;

const pick = <T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Pick<T, K> =>
  Object.fromEntries(
    keys.filter((key) => key in source).map((key) => [key, source[key]]),
  ) as Pick<T, K>;

/** Fields a record can change after creation; the rest are set once. */
export const sessionUpdateValues = (
  values: SessionCreateInput,
): SessionUpdateInput =>
  pick(values, ['status', 'endedAt', 'durationMinutes', 'comment']);

export const setLogUpdateValues = (
  values: SetLogCreateInput,
): SetLogUpdateInput =>
  pick(values, ['reps', 'weightKg', 'rir', 'restSeconds', 'comment']);

/**
 * Records to flush, sessions first and oldest first, so a set is never sent
 * before the session it belongs to.
 */
export const pendingRecords = (records: LocalRecord[]): LocalRecord[] =>
  records
    .filter((record) => record.dirty)
    .sort(
      (a, b) =>
        (a.kind === 'session' ? 0 : 1) - (b.kind === 'session' ? 0 : 1) ||
        a.updatedAt.localeCompare(b.updatedAt),
    );

/** Merges an edit into a record, keeping it queued as a single write. */
export const withValues = <T extends LocalRecord>(
  record: T,
  values: Partial<T['values']>,
  updatedAt: string,
): T => ({
  ...record,
  values: { ...record.values, ...values },
  dirty: true,
  updatedAt,
});
