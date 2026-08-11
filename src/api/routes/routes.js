import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@api/index.js';
import { withTimeout } from '@utils/async.js';
import { t } from '@utils/i18n.js';

export function watchRoutes(tripId, onData) {
  const q = query(collection(db, 'trips', tripId, 'routes'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function addRoute(tripId, route) {
  return withTimeout(
    addDoc(collection(db, 'trips', tripId, 'routes'), {
      fromPlaceId: route.fromPlaceId,
      toPlaceId: route.toPlaceId,
      profile: 'foot-walking',
      geometry: route.geometry,
      distanceMeters: route.distanceMeters,
      durationSeconds: route.durationSeconds,
      addedBy: route.addedBy,
      addedByName: route.addedByName,
      createdAt: serverTimestamp(),
    }),
    12000,
    t('errors.addRoute'),
  );
}

export function deleteRoute(tripId, routeId) {
  return withTimeout(
    deleteDoc(doc(db, 'trips', tripId, 'routes', routeId)),
    12000,
    t('errors.deleteRoute'),
  );
}
