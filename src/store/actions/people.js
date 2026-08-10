/*
 *
 * People Actions
 *
 */

import { createAction } from '@utils/action';

export const actionTypes = {
  SUBSCRIBE: '@@people/subscribe',
  RECEIVED: '@@people/received',
  ADD_REQUEST: '@@people/add_request',
  ADD_SUCCESS: '@@people/add_success',
  ADD_FAILURE: '@@people/add_failure',
  CLEAR_ERROR: '@@people/clear_error',
  // @generator action:action-type
};

export const subscribePeople = (tripId) => createAction(actionTypes.SUBSCRIBE, tripId);
export const peopleReceived = (list) => createAction(actionTypes.RECEIVED, list);
// payload: { tripId, name, claim } — `claim` sets the added person as "me"
export const addPersonRequest = (payload) => createAction(actionTypes.ADD_REQUEST, payload);
export const addPersonSuccess = () => createAction(actionTypes.ADD_SUCCESS);
export const addPersonFailure = (error) => createAction(actionTypes.ADD_FAILURE, error);
export const clearPeopleError = () => createAction(actionTypes.CLEAR_ERROR);
// @generator action:method
