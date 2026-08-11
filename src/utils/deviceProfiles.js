// Device-local memory of names used on this browser, across trips — powers
// a "suggested" pre-fill in the identity picker. Not synced, not shared,
// unrelated to the per-trip Firestore `people` data.
//
// ponytail: every failure path (private-browsing quirks, indexedDB
// unavailable, etc.) resolves to "no data" instead of rejecting, so the
// feature just degrades to "no suggestion" rather than crashing a caller.

const DB_NAME = 'carovana';
const DB_VERSION = 1;
const STORE = 'profiles';

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('indexedDB unavailable'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('by_name', 'nameLower', { unique: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function listDeviceProfiles() {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.lastUsedAt - a.lastUsedAt));
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

export async function upsertDeviceProfile(name) {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const nameLower = trimmed.toLowerCase();

  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const store = db.transaction(STORE, 'readwrite').objectStore(STORE);
      const index = store.index('by_name');
      const lookup = index.get(nameLower);

      lookup.onsuccess = () => {
        const existing = lookup.result;
        const record = existing
          ? { ...existing, name: trimmed, nameLower, lastUsedAt: Date.now() }
          : { id: crypto.randomUUID(), name: trimmed, nameLower, lastUsedAt: Date.now() };
        const put = store.put(record);
        put.onsuccess = () => resolve(record);
        put.onerror = () => reject(put.error);
      };
      lookup.onerror = () => reject(lookup.error);
    });
  } catch {
    return null;
  }
}
