import { put, takeEvery } from 'redux-saga/effects';
import * as actions from '@store/actions/identity.js';
import { actionTypes } from '@store/actions/identity.js';

function storageKey(tripId) {
  return `carovana:me:${tripId}`;
}

function readStoredMe(tripId) {
  try {
    const raw = localStorage.getItem(storageKey(tripId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function* loadIdentity(action) {
  const tripId = action.payload;
  yield put(actions.identityResolved(readStoredMe(tripId)));
}

function* setIdentity(action) {
  const { tripId, person } = action.payload;
  localStorage.setItem(storageKey(tripId), JSON.stringify(person));
  yield put(actions.identityResolved(person));
}

function* clearIdentity(action) {
  const tripId = action.payload;
  localStorage.removeItem(storageKey(tripId));
  yield put(actions.identityResolved(null));
}

// @generator saga:method

export default function* identitySaga() {
  yield takeEvery(actionTypes.LOAD, loadIdentity);
  yield takeEvery(actionTypes.SET, setIdentity);
  yield takeEvery(actionTypes.CLEAR, clearIdentity);
  // @generator saga:watch
}
