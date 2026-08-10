import { eventChannel } from 'redux-saga';
import { call, cancelled, put, take, takeLatest } from 'redux-saga/effects';
import * as api from '@api/trip/trip.js';
import * as actions from '@store/actions/trip.js';
import { actionTypes } from '@store/actions/trip.js';

function createTripChannel(tripId) {
  return eventChannel((emit) => api.watchTrip(tripId, (trip) => emit({ trip })));
}

function* watchTripData(action) {
  const tripId = action.payload;
  if (!tripId) return;
  const channel = yield call(createTripChannel, tripId);
  try {
    while (true) {
      const { trip } = yield take(channel);
      yield put(actions.tripReceived(trip));
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

// @generator saga:method

export default function* tripSaga() {
  yield takeLatest(actionTypes.SUBSCRIBE, watchTripData);
  // @generator saga:watch
}
