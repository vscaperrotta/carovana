import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@api/index.js';
import { withTimeout } from '@utils/async.js';
import { t } from '@utils/i18n.js';

export function watchPlaces(tripId, onData) {
  const q = query(
    collection(db, 'trips', tripId, 'places'),
    orderBy('createdAt', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function addPlace(tripId, place) {
  return withTimeout(
    addDoc(collection(db, 'trips', tripId, 'places'), {
      type: place.type, // 'stay' | 'poi'
      title: place.title.trim(),
      price: place.price ?? null,
      url: place.url?.trim() || null,
      source: place.source || null,
      address: place.address || null,
      lat: place.lat,
      lng: place.lng,
      addedBy: place.addedBy,
      addedByName: place.addedByName,
      createdAt: serverTimestamp(),
      votes: {},
    }),
    12000,
    t('errors.addPlace'),
  );
}

export function editPlace(tripId, placeId, { title, price, url, source, address, lat, lng }) {
  return withTimeout(
    updateDoc(doc(db, 'trips', tripId, 'places', placeId), {
      title: title.trim(),
      price: price ?? null,
      url: url?.trim() || null,
      source: source || null,
      address: address || null,
      lat,
      lng,
    }),
    12000,
    t('errors.editPlace'),
  );
}

export function deletePlace(tripId, placeId) {
  return withTimeout(
    deleteDoc(doc(db, 'trips', tripId, 'places', placeId)),
    12000,
    t('errors.deletePlace'),
  );
}

export function toggleVote(tripId, placeId, personId, hasVoted) {
  return withTimeout(
    updateDoc(doc(db, 'trips', tripId, 'places', placeId), {
      [`votes.${personId}`]: hasVoted ? deleteField() : true,
    }),
    12000,
    t('errors.vote'),
  );
}
// @generator api:method
