import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getCountFromServer,
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

export function watchPeople(tripId, onData) {
  const q = query(
    collection(db, 'trips', tripId, 'people'),
    orderBy('createdAt', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function countPeople(tripId) {
  const snap = await getCountFromServer(collection(db, 'trips', tripId, 'people'));
  return snap.data().count;
}

export function addPerson(tripId, name) {
  return withTimeout(
    addDoc(collection(db, 'trips', tripId, 'people'), {
      name: name.trim(),
      createdAt: serverTimestamp(),
    }),
    12000,
    t('errors.addPerson'),
  );
}

export function renamePerson(tripId, personId, name) {
  return withTimeout(
    updateDoc(doc(db, 'trips', tripId, 'people', personId), { name: name.trim() }),
    12000,
    t('errors.renamePerson'),
  );
}

// Also strips this person's votes from every place so counts don't stay
// inflated by someone who's no longer in the trip.
export function deletePerson(tripId, personId) {
  return withTimeout(
    (async () => {
      const placesSnap = await getDocs(collection(db, 'trips', tripId, 'places'));
      const batch = writeBatch(db);
      placesSnap.docs.forEach((placeDoc) => {
        if (placeDoc.data().votes?.[personId] !== undefined) {
          batch.update(placeDoc.ref, { [`votes.${personId}`]: deleteField() });
        }
      });
      batch.delete(doc(db, 'trips', tripId, 'people', personId));
      await batch.commit();
    })(),
    12000,
    t('errors.deletePerson'),
  );
}
// @generator api:method
