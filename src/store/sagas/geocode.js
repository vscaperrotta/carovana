import { call, debounce, put, takeLatest } from 'redux-saga/effects';
import * as api from '@api/geocode/geocode.js';
import * as actions from '@store/actions/geocode.js';
import { actionTypes } from '@store/actions/geocode.js';

function* searchAddress(action) {
  const query = action.payload;
  if (query.trim().length < 3) {
    yield put(actions.clearAddressSearch());
    return;
  }
  try {
    const results = yield call(api.searchAddress, query);
    yield put(actions.searchAddressSuccess(results));
  } catch (error) {
    if (error.name !== 'AbortError') yield put(actions.searchAddressSuccess([]));
  }
}

function* reverseGeocode(action) {
  const { lat, lng } = action.payload;
  const address = yield call(api.reverseGeocode, lat, lng);
  yield put(actions.reverseGeocodeSuccess({ lat, lng, address }));
}

// @generator saga:method

export default function* geocodeSaga() {
  yield debounce(400, actionTypes.SEARCH_REQUEST, searchAddress);
  yield takeLatest(actionTypes.REVERSE_REQUEST, reverseGeocode);
  // @generator saga:watch
}
