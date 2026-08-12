import { call, put, takeEvery } from 'redux-saga/effects';
import * as actions from '@store/actions/identity.js';
import { actionTypes } from '@store/actions/identity.js';
import { addPersonRequest } from '@store/actions/people.js';
import { listDeviceProfiles, upsertDeviceProfile } from '@utils/deviceProfiles.js';

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

function* loadDeviceProfiles() {
  const list = yield call(listDeviceProfiles);
  yield put(actions.deviceProfilesReceived(list));
}

function* confirmIdentity(action) {
  const { tripId, personId, name, isNew } = action.payload;
  if (isNew) {
    // The people saga owns the Firestore write and dispatches setIdentity
    // itself on success — same "add + claim" path IdentityGate already used.
    yield put(addPersonRequest({ tripId, name, claim: true }));
  } else {
    yield put(actions.setIdentity({ tripId, person: { id: personId, name } }));
  }

  yield call(upsertDeviceProfile, name.trim());
  yield put(actions.sessionConfirmed());
}

// @generator saga:method

export default function* identitySaga() {
  yield takeEvery(actionTypes.LOAD, loadIdentity);
  yield takeEvery(actionTypes.SET, setIdentity);
  yield takeEvery(actionTypes.CLEAR, clearIdentity);
  yield takeEvery(actionTypes.LOAD_DEVICE_PROFILES, loadDeviceProfiles);
  yield takeEvery(actionTypes.CONFIRM, confirmIdentity);
  // @generator saga:watch
}
