import { eventChannel } from 'redux-saga';
import { call, cancelled, put, take, takeLatest } from 'redux-saga/effects';
import * as api from '@api/trips/trips.js';
import * as actions from '@store/actions/trips.js';
import { actionTypes } from '@store/actions/trips.js';

function createTripsChannel() {
  return eventChannel((emit) => api.watchTrips((list) => emit(list)));
}

function* watchTripsData() {
  const channel = yield call(createTripsChannel);
  try {
    while (true) {
      const list = yield take(channel);
      yield put(actions.tripsReceived(list));
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

function* createTrip(action) {
  try {
    const ref = yield call(api.createTrip, action.payload);
    yield put(actions.createTripSuccess(ref.id));
  } catch (error) {
    yield put(actions.createTripFailure(error.message));
  }
}

function* renameTrip(action) {
  const { tripId, name } = action.payload;
  try {
    yield call(api.renameTrip, tripId, name);
    yield put(actions.renameTripSuccess());
  } catch (error) {
    yield put(actions.renameTripFailure(error.message));
  }
}

function* deleteTrip(action) {
  const { tripId } = action.payload;
  try {
    yield call(api.deleteTrip, tripId);
    yield put(actions.deleteTripSuccess(tripId));
  } catch (error) {
    yield put(actions.deleteTripFailure(error.message));
  }
}

// @generator saga:method

export default function* tripsSaga() {
  yield takeLatest(actionTypes.SUBSCRIBE, watchTripsData);
  yield takeLatest(actionTypes.CREATE_REQUEST, createTrip);
  yield takeLatest(actionTypes.RENAME_REQUEST, renameTrip);
  yield takeLatest(actionTypes.DELETE_REQUEST, deleteTrip);
  // @generator saga:watch
}
