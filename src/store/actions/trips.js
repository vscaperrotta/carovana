/*
 *
 * Trips Actions
 *
 */

import { createAction } from '@utils/action';

export const actionTypes = {
  SUBSCRIBE: '@@trips/subscribe',
  RECEIVED: '@@trips/received',
  CREATE_REQUEST: '@@trips/create_request',
  CREATE_SUCCESS: '@@trips/create_success',
  CREATE_FAILURE: '@@trips/create_failure',
  CLEAR_CREATED: '@@trips/clear_created',
  RENAME_REQUEST: '@@trips/rename_request',
  RENAME_SUCCESS: '@@trips/rename_success',
  RENAME_FAILURE: '@@trips/rename_failure',
  DELETE_REQUEST: '@@trips/delete_request',
  DELETE_SUCCESS: '@@trips/delete_success',
  DELETE_FAILURE: '@@trips/delete_failure',
  CLEAR_ERROR: '@@trips/clear_error',
  // @generator action:action-type
};

export const subscribeTrips = () => createAction(actionTypes.SUBSCRIBE);
export const tripsReceived = (list) => createAction(actionTypes.RECEIVED, list);
export const createTripRequest = (payload) => createAction(actionTypes.CREATE_REQUEST, payload);
export const createTripSuccess = (id) => createAction(actionTypes.CREATE_SUCCESS, id);
export const createTripFailure = (error) => createAction(actionTypes.CREATE_FAILURE, error);
export const clearCreatedTrip = () => createAction(actionTypes.CLEAR_CREATED);
// payload: { tripId, name, startDate, endDate }
export const renameTripRequest = (payload) => createAction(actionTypes.RENAME_REQUEST, payload);
export const renameTripSuccess = () => createAction(actionTypes.RENAME_SUCCESS);
export const renameTripFailure = (error) => createAction(actionTypes.RENAME_FAILURE, error);
// payload: { tripId }
export const deleteTripRequest = (payload) => createAction(actionTypes.DELETE_REQUEST, payload);
export const deleteTripSuccess = (tripId) => createAction(actionTypes.DELETE_SUCCESS, tripId);
export const deleteTripFailure = (error) => createAction(actionTypes.DELETE_FAILURE, error);
export const clearTripActionError = () => createAction(actionTypes.CLEAR_ERROR);
// @generator action:method
