import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@api/index.js';
import { withTimeout } from '@utils/async.js';
import { t } from '@utils/i18n.js';

/**
 * Subscribe to the trips collection. Returns the firestore unsubscribe fn.
 */
export function watchTrips(onData) {
  const q = query(collection(db, 'trips'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function createTrip({ name, startDate, endDate }) {
  return withTimeout(
    addDoc(collection(db, 'trips'), {
      name: name.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      createdAt: serverTimestamp(),
    }),
    12000,
    t('errors.createTrip'),
  );
}

export function renameTrip(tripId, { name, startDate, endDate }) {
  return withTimeout(
    updateDoc(doc(db, 'trips', tripId), {
      name: name.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
    }),
    12000,
    t('errors.renameTrip'),
  );
}

// Deletes the trip doc plus its places/people subcollections — Firestore
// doesn't cascade-delete subcollections on its own.
export function deleteTrip(tripId) {
  return withTimeout(
    (async () => {
      const [placesSnap, peopleSnap] = await Promise.all([
        getDocs(collection(db, 'trips', tripId, 'places')),
        getDocs(collection(db, 'trips', tripId, 'people')),
      ]);
      const batch = writeBatch(db);
      placesSnap.docs.forEach((d) => batch.delete(d.ref));
      peopleSnap.docs.forEach((d) => batch.delete(d.ref));
      batch.delete(doc(db, 'trips', tripId));
      await batch.commit();
    })(),
    12000,
    t('errors.deleteTrip'),
  );
}
// @generator api:method
