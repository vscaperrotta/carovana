import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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
// @generator api:method
