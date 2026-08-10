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
  // @generator action:action-type
};

export const loadIdentity = (tripId) => createAction(actionTypes.LOAD, tripId);
// payload: { tripId, person }
export const setIdentity = (payload) => createAction(actionTypes.SET, payload);
export const clearIdentity = (tripId) => createAction(actionTypes.CLEAR, tripId);
export const identityResolved = (me) => createAction(actionTypes.RESOLVED, me);
// @generator action:method
