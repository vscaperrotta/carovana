/*
 *
 * Geocode Actions
 *
 */

import { createAction } from '@utils/action';

export const actionTypes = {
  SEARCH_REQUEST: '@@geocode/search_request',
  SEARCH_SUCCESS: '@@geocode/search_success',
  SEARCH_CLEAR: '@@geocode/search_clear',
  REVERSE_REQUEST: '@@geocode/reverse_request',
  REVERSE_SUCCESS: '@@geocode/reverse_success',
  // @generator action:action-type
};

export const searchAddressRequest = (query) => createAction(actionTypes.SEARCH_REQUEST, query);
export const searchAddressSuccess = (results) => createAction(actionTypes.SEARCH_SUCCESS, results);
export const clearAddressSearch = () => createAction(actionTypes.SEARCH_CLEAR);
// payload: { lat, lng }
export const reverseGeocodeRequest = (payload) => createAction(actionTypes.REVERSE_REQUEST, payload);
// payload: { lat, lng, address }
export const reverseGeocodeSuccess = (payload) => createAction(actionTypes.REVERSE_SUCCESS, payload);
// @generator action:method
