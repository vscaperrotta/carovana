/*
 *
 * Trip Actions
 *
 */

import { createAction } from '@utils/action';

export const actionTypes = {
  SUBSCRIBE: '@@trip/subscribe',
  RECEIVED: '@@trip/received',
  RESET: '@@trip/reset',
  // @generator action:action-type
};

export const subscribeTrip = (tripId) => createAction(actionTypes.SUBSCRIBE, tripId);
export const tripReceived = (trip) => createAction(actionTypes.RECEIVED, trip);
export const resetTrip = () => createAction(actionTypes.RESET);
// @generator action:method
