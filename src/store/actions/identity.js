/*
 *
 * Identity Actions
 *
 * "Me" is per-trip and stored on this device (localStorage). The saga owns
 * the persistence; the reducer only mirrors the current value.
 */

import { createAction } from '@utils/action';

export const actionTypes = {
  LOAD: '@@identity/load',
  SET: '@@identity/set',
  CLEAR: '@@identity/clear',
  RESOLVED: '@@identity/resolved',
  LOAD_DEVICE_PROFILES: '@@identity/load_device_profiles',
  DEVICE_PROFILES_RECEIVED: '@@identity/device_profiles_received',
  CONFIRM: '@@identity/confirm',
  SESSION_CONFIRMED: '@@identity/session_confirmed',
  // @generator action:action-type
};

export const loadIdentity = (tripId) => createAction(actionTypes.LOAD, tripId);
// payload: { tripId, person }
export const setIdentity = (payload) => createAction(actionTypes.SET, payload);
export const clearIdentity = (tripId) => createAction(actionTypes.CLEAR, tripId);
export const identityResolved = (me) => createAction(actionTypes.RESOLVED, me);
// Device-local (IndexedDB) "names used on this browser" memory — cross-trip,
// separate from the per-trip `me` binding above.
export const loadDeviceProfiles = () => createAction(actionTypes.LOAD_DEVICE_PROFILES);
export const deviceProfilesReceived = (list) => createAction(actionTypes.DEVICE_PROFILES_RECEIVED, list);
// payload: { tripId, personId, name, isNew } — the single entry point the
// identity modal dispatches for every resolution path (claim / add new /
// "still you" reconfirm). Fans out to setIdentity or addPersonRequest,
// the IndexedDB upsert, and the session-confirmed flag.
export const confirmIdentity = (payload) => createAction(actionTypes.CONFIRM, payload);
export const sessionConfirmed = () => createAction(actionTypes.SESSION_CONFIRMED);
// @generator action:method
