import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '@store/actions/identity.js';
import { actionTypes } from '@store/actions/identity.js';
import { addPersonRequest, renamePersonRequest } from '@store/actions/people.js';
import { selectMe, selectPeople } from '@store/selectors';
import { getActiveProfile, listDeviceProfiles, setActiveIdentity } from '@utils/deviceIdentity.js';

function* load() {
  const [profile, profiles] = yield all([call(getActiveProfile), call(listDeviceProfiles)]);
  yield put(actions.identityResolved(profile));
  yield put(actions.profilesReceived(profiles));
}

function* applySetName(action) {
  const { name, tripId } = action.payload;
  if (tripId) {
    // Read the trip match *before* the identity changes, so we know which
    // Person (if any) to keep in sync under the old name.
    const currentMe = yield select(selectMe);
    if (currentMe) {
      yield put(renamePersonRequest({ tripId, personId: currentMe.id, name }));
    }
  }
  const profile = yield call(setActiveIdentity, name);
  yield put(actions.identityResolved(profile));
}

function* joinTrip(action) {
  const { tripId, name } = action.payload;
  const profile = yield call(setActiveIdentity, name);
  yield put(actions.identityResolved(profile));

  const people = yield select(selectPeople);
  const nameLower = name.trim().toLowerCase();
  const exists = people.some((person) => person.name.trim().toLowerCase() === nameLower);
  if (!exists) yield put(addPersonRequest({ tripId, name }));
}

// @generator saga:method

export default function* identitySaga() {
  yield takeEvery(actionTypes.LOAD, load);
  yield takeEvery(actionTypes.SET_NAME, applySetName);
  yield takeEvery(actionTypes.JOIN_TRIP, joinTrip);
  // @generator saga:watch
}
