/*
 *
 * Identity Actions
 *
 * A single session-wide identity (IndexedDB, spans every trip) — "who am
 * I", not "who am I in this trip". Per-trip membership (`selectMe`) is a
 * derived selector, not stored here.
 */

import { createAction } from '@utils/action';

export const actionTypes = {
  LOAD: '@@identity/load',
  RESOLVED: '@@identity/resolved',
  PROFILES_RECEIVED: '@@identity/profiles_received',
  SET_NAME: '@@identity/set_name',
  JOIN_TRIP: '@@identity/join_trip',
  // @generator action:action-type
};

// Loads the active identity + known-names history from IndexedDB.
export const loadIdentity = () => createAction(actionTypes.LOAD);
export const identityResolved = (profile) => createAction(actionTypes.RESOLVED, profile);
export const profilesReceived = (list) => createAction(actionTypes.PROFILES_RECEIVED, list);
// payload: { name, tripId? } — sets the session identity everywhere; when
// tripId is given and you already matched a Person there under the old
// name, that Person also gets renamed so the trip you're looking at stays
// in sync live.
export const setName = (payload) => createAction(actionTypes.SET_NAME, payload);
// payload: { tripId, name } — sets the session identity AND ensures a
// Person with that name exists in this trip (creates one if not).
export const joinTrip = (payload) => createAction(actionTypes.JOIN_TRIP, payload);
// @generator action:method
