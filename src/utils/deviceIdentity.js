// Device-local identity: which name this browser is currently "logged in"
// as (session-wide, spans every trip), plus the history of names ever used
// here (powers the "known names" quick-pick when switching). Not synced,
// not shared, unrelated to the per-trip Firestore `people` data — matching
// a trip's Person by name is done elsewhere from this data.
//
// ponytail: every failure path (private-browsing quirks, indexedDB
// unavailable, etc.) resolves to "no data" instead of rejecting, so the
// feature just degrades to "no identity" rather than crashing a caller.

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

export async function getActiveProfile() {
  const profiles = await listDeviceProfiles();
  return profiles.find((profile) => profile.active) ?? null;
}

// Upserts a profile by name and marks it (exclusively) as the active
// session identity — covers "pick a known name", "set a brand new name",
// and "rename" with the same call, since they're all "this is who I am now".
export async function setActiveIdentity(name) {
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
        const record = {
          ...existing,
          id: existing?.id ?? crypto.randomUUID(),
          name: trimmed,
          nameLower,
          lastUsedAt: Date.now(),
          active: true,
        };

        const allRequest = store.getAll();
        allRequest.onsuccess = () => {
          allRequest.result
            .filter((profile) => profile.active && profile.id !== record.id)
            .forEach((profile) => store.put({ ...profile, active: false }));
          const put = store.put(record);
          put.onsuccess = () => resolve(record);
          put.onerror = () => reject(put.error);
        };
        allRequest.onerror = () => reject(allRequest.error);
      };
      lookup.onerror = () => reject(lookup.error);
    });
  } catch {
    return null;
  }
}
