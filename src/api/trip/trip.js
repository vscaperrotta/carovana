import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@api/index.js';

/**
 * Subscribe to a single trip document. `onData` receives the trip object,
 * or `null` when the document does not exist. Returns the unsubscribe fn.
 */
export function watchTrip(tripId, onData) {
  return onSnapshot(doc(db, 'trips', tripId), (snap) => {
    onData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}
// @generator api:method
