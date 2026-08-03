import { pendingOperations, type LocalRecord } from '@coach-twenty/shared';

import { loadRecords, markSynced } from './localStore';
import {
  createSessionRemote,
  createSetLogRemote,
  updateSessionRemote,
  updateSetLogRemote,
} from './session';

export type SyncState = {
  pending: number;
  /** Set when the last attempt failed — the records stay queued. */
  error: string | null;
};

const send = async (
  operation: ReturnType<typeof pendingOperations>[number],
): Promise<void> => {
  const { record } = operation;
  if (operation.type === 'create') {
    await (record.kind === 'session'
      ? createSessionRemote(record.id, record.values)
      : createSetLogRemote(record.id, record.values));
    return;
  }
  await (record.kind === 'session'
    ? updateSessionRemote(record.id, operation.values)
    : updateSetLogRemote(record.id, operation.values));
};

let inFlight: Promise<SyncState> | null = null;

/**
 * Flushes every dirty record, oldest first. Stops at the first failure so a
 * set is never sent before the session it belongs to; whatever is left stays
 * queued for the next attempt.
 */
export const flush = async (): Promise<SyncState> => {
  inFlight ??= (async () => {
    try {
      const records = await loadRecords();
      const operations = pendingOperations(records);
      for (const operation of operations) {
        try {
          await send(operation);
          await markSynced(operation.record);
        } catch (error) {
          return {
            pending: (await loadRecords()).filter((record) => record.dirty)
              .length,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }
      return { pending: 0, error: null };
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
};

export const pendingCount = async (): Promise<number> =>
  (await loadRecords()).filter((record: LocalRecord) => record.dirty).length;

/**
 * Flushes on reconnect and periodically, so a session logged in a basement
 * reaches the server without the trainee doing anything.
 */
export const startAutoSync = (onState: (state: SyncState) => void): (() => void) => {
  const attempt = () => {
    void flush().then(onState);
  };
  window.addEventListener('online', attempt);
  const timer = setInterval(attempt, 30_000);
  attempt();
  return () => {
    window.removeEventListener('online', attempt);
    clearInterval(timer);
  };
};
