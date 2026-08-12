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
  RENAME_REQUEST: '@@people/rename_request',
  RENAME_SUCCESS: '@@people/rename_success',
  RENAME_FAILURE: '@@people/rename_failure',
  DELETE_REQUEST: '@@people/delete_request',
  DELETE_SUCCESS: '@@people/delete_success',
  DELETE_FAILURE: '@@people/delete_failure',
  CLEAR_ERROR: '@@people/clear_error',
  // @generator action:action-type
};

export const subscribePeople = (tripId) => createAction(actionTypes.SUBSCRIBE, tripId);
export const peopleReceived = (list) => createAction(actionTypes.RECEIVED, list);
// payload: { tripId, name }
export const addPersonRequest = (payload) => createAction(actionTypes.ADD_REQUEST, payload);
export const addPersonSuccess = () => createAction(actionTypes.ADD_SUCCESS);
export const addPersonFailure = (error) => createAction(actionTypes.ADD_FAILURE, error);
// payload: { tripId, personId, name }
export const renamePersonRequest = (payload) => createAction(actionTypes.RENAME_REQUEST, payload);
export const renamePersonSuccess = () => createAction(actionTypes.RENAME_SUCCESS);
export const renamePersonFailure = (error) => createAction(actionTypes.RENAME_FAILURE, error);
// payload: { tripId, personId }
export const deletePersonRequest = (payload) => createAction(actionTypes.DELETE_REQUEST, payload);
export const deletePersonSuccess = () => createAction(actionTypes.DELETE_SUCCESS);
export const deletePersonFailure = (error) => createAction(actionTypes.DELETE_FAILURE, error);
export const clearPeopleError = () => createAction(actionTypes.CLEAR_ERROR);
// @generator action:method
