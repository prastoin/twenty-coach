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

export type LocalRecordKind = 'session' | 'setLog';

export type LocalRecord = {
  /** Generated on the device, so replay after an ambiguous failure is idempotent. */
  id: string;
  kind: LocalRecordKind;
  /** Current values, as the API expects them. */
  values: Record<string, unknown>;
  /** Whether a create for this record has been acknowledged by the server. */
  serverKnown: boolean;
  /** Whether the local values are ahead of the server. */
  dirty: boolean;
  /** Device clock, not the server's — the moment the trainee acted. */
  updatedAt: string;
};

export type SyncOperation =
  | { type: 'create'; record: LocalRecord }
  | { type: 'update'; record: LocalRecord; values: Record<string, unknown> };

/** Fields a record can change after creation; the rest are set once. */
const MUTABLE_FIELDS: Record<LocalRecordKind, string[]> = {
  session: ['status', 'endedAt', 'durationMinutes', 'comment'],
  setLog: ['reps', 'weightKg', 'rir', 'restSeconds', 'comment'],
};

export const operationFor = (record: LocalRecord): SyncOperation =>
  record.serverKnown
    ? {
        type: 'update',
        record,
        values: Object.fromEntries(
          MUTABLE_FIELDS[record.kind]
            .filter((field) => field in record.values)
            .map((field) => [field, record.values[field]]),
        ),
      }
    : { type: 'create', record };

/**
 * Records to flush, oldest first: a session is always created before the
 * sets that reference it.
 */
export const pendingOperations = (records: LocalRecord[]): SyncOperation[] =>
  records
    .filter((record) => record.dirty)
    .sort(
      (a, b) =>
        (a.kind === 'session' ? 0 : 1) - (b.kind === 'session' ? 0 : 1) ||
        a.updatedAt.localeCompare(b.updatedAt),
    )
    .map(operationFor);

/** Merges an edit into a record, keeping it queued as a single write. */
export const withValues = (
  record: LocalRecord,
  values: Record<string, unknown>,
  updatedAt: string,
): LocalRecord => ({
  ...record,
  values: { ...record.values, ...values },
  dirty: true,
  updatedAt,
});
