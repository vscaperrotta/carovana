/*
 *
 * Routes Actions
 *
 */

import { createAction } from '@utils/action';

export const actionTypes = {
  SUBSCRIBE: '@@routes/subscribe',
  RECEIVED: '@@routes/received',
  ADD_REQUEST: '@@routes/add_request',
  ADD_SUCCESS: '@@routes/add_success',
  ADD_FAILURE: '@@routes/add_failure',
  DELETE_REQUEST: '@@routes/delete_request',
  CLEAR_ERROR: '@@routes/clear_error',
};

export const subscribeRoutes = (tripId) => createAction(actionTypes.SUBSCRIBE, tripId);
export const routesReceived = (list) => createAction(actionTypes.RECEIVED, list);
// payload: { tripId, fromPlace, toPlace, addedBy, addedByName }
export const addRouteRequest = (payload) => createAction(actionTypes.ADD_REQUEST, payload);
export const addRouteSuccess = (quota) => createAction(actionTypes.ADD_SUCCESS, quota);
export const addRouteFailure = (error) => createAction(actionTypes.ADD_FAILURE, error);
// payload: { tripId, routeId }
export const deleteRouteRequest = (payload) => createAction(actionTypes.DELETE_REQUEST, payload);
export const clearRoutesError = () => createAction(actionTypes.CLEAR_ERROR);
