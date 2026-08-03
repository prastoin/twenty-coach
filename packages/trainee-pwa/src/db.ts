// Minimal IndexedDB access. Two stores: the records the trainee has written
// (authoritative locally until synced) and a cache of the last read model
// fetched from the server, so the app opens with content while offline.

const DB_NAME = 'coach-pwa';
const DB_VERSION = 1;

export const RECORDS = 'records';
export const CACHE = 'cache';

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(RECORDS)) {
        db.createObjectStore(RECORDS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CACHE)) {
        db.createObjectStore(CACHE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

let connection: Promise<IDBDatabase> | null = null;

const database = (): Promise<IDBDatabase> => {
  connection ??= openDatabase();
  return connection;
};

const run = async <T>(
  store: string,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  const db = await database();
  return new Promise((resolve, reject) => {
    const request = action(db.transaction(store, mode).objectStore(store));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const putRecord = <T>(store: string, value: T, key?: IDBValidKey) =>
  run(store, 'readwrite', (objectStore) =>
    key === undefined ? objectStore.put(value) : objectStore.put(value, key),
  );

export const getRecord = <T>(store: string, key: IDBValidKey) =>
  run<T | undefined>(store, 'readonly', (objectStore) => objectStore.get(key));

export const allRecords = <T>(store: string) =>
  run<T[]>(store, 'readonly', (objectStore) => objectStore.getAll());

export const deleteRecord = (store: string, key: IDBValidKey) =>
  run(store, 'readwrite', (objectStore) => objectStore.delete(key));
