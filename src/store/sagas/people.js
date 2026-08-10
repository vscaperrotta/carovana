import { eventChannel } from 'redux-saga';
import { call, cancelled, put, take, takeEvery, takeLatest } from 'redux-saga/effects';
import * as api from '@api/people/people.js';
import * as actions from '@store/actions/people.js';
import { actionTypes } from '@store/actions/people.js';
import { setIdentity } from '@store/actions/identity.js';

function createPeopleChannel(tripId) {
  return eventChannel((emit) => api.watchPeople(tripId, (list) => emit(list)));
}

function* watchPeopleData(action) {
  const tripId = action.payload;
  if (!tripId) return;
  const channel = yield call(createPeopleChannel, tripId);
  try {
    while (true) {
      const list = yield take(channel);
      yield put(actions.peopleReceived(list));
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

function* addPerson(action) {
  const { tripId, name, claim } = action.payload;
  try {
    const ref = yield call(api.addPerson, tripId, name);
    yield put(actions.addPersonSuccess());
    if (claim) {
      yield put(setIdentity({ tripId, person: { id: ref.id, name: name.trim() } }));
    }
  } catch (error) {
    yield put(actions.addPersonFailure(error.message));
  }
}

// @generator saga:method

export default function* peopleSaga() {
  yield takeLatest(actionTypes.SUBSCRIBE, watchPeopleData);
  yield takeEvery(actionTypes.ADD_REQUEST, addPerson);
  // @generator saga:watch
}
