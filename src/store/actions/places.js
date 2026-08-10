/*
 *
 * Places Actions
 *
 */

import { createAction } from '@utils/action';

export const actionTypes = {
  SUBSCRIBE: '@@places/subscribe',
  RECEIVED: '@@places/received',
  ADD_REQUEST: '@@places/add_request',
  ADD_SUCCESS: '@@places/add_success',
  ADD_FAILURE: '@@places/add_failure',
  DELETE_REQUEST: '@@places/delete_request',
  VOTE_REQUEST: '@@places/vote_request',
  CLEAR_ERROR: '@@places/clear_error',
  // @generator action:action-type
};

export const subscribePlaces = (tripId) => createAction(actionTypes.SUBSCRIBE, tripId);
export const placesReceived = (list) => createAction(actionTypes.RECEIVED, list);
// payload: { tripId, place }
export const addPlaceRequest = (payload) => createAction(actionTypes.ADD_REQUEST, payload);
export const addPlaceSuccess = () => createAction(actionTypes.ADD_SUCCESS);
export const addPlaceFailure = (error) => createAction(actionTypes.ADD_FAILURE, error);
// payload: { tripId, placeId }
export const deletePlaceRequest = (payload) => createAction(actionTypes.DELETE_REQUEST, payload);
// payload: { tripId, placeId, personId, hasVoted }
export const votePlaceRequest = (payload) => createAction(actionTypes.VOTE_REQUEST, payload);
export const clearPlacesError = () => createAction(actionTypes.CLEAR_ERROR);
// @generator action:method
