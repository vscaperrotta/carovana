import { eventChannel } from 'redux-saga';
import { call, cancelled, put, take, takeEvery, takeLatest } from 'redux-saga/effects';
import * as api from '@api/routes/routes.js';
import * as ors from '@api/ors/ors.js';
import * as actions from '@store/actions/routes.js';
import { actionTypes } from '@store/actions/routes.js';

function createRoutesChannel(tripId) {
  return eventChannel((emit) => api.watchRoutes(tripId, (list) => emit(list)));
}

function* watchRoutesData(action) {
  const tripId = action.payload;
  if (!tripId) return;
  const channel = yield call(createRoutesChannel, tripId);
  try {
    while (true) {
      const list = yield take(channel);
      yield put(actions.routesReceived(list));
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

function* addRoute(action) {
  const { tripId, fromPlace, toPlace, addedBy, addedByName } = action.payload;
  try {
    const { geometry, distanceMeters, durationSeconds, quota } = yield call(
      ors.fetchWalkingRoute,
      fromPlace,
      toPlace,
    );
    yield call(api.addRoute, tripId, {
      fromPlaceId: fromPlace.id,
      toPlaceId: toPlace.id,
      geometry,
      distanceMeters,
      durationSeconds,
      addedBy,
      addedByName,
    });
    yield put(actions.addRouteSuccess(quota));
  } catch (error) {
    yield put(actions.addRouteFailure(error.message));
  }
}

function* deleteRoute(action) {
  const { tripId, routeId } = action.payload;
  try {
    yield call(api.deleteRoute, tripId, routeId);
  } catch (error) {
    yield put(actions.addRouteFailure(error.message));
  }
}

export default function* routesSaga() {
  yield takeLatest(actionTypes.SUBSCRIBE, watchRoutesData);
  yield takeEvery(actionTypes.ADD_REQUEST, addRoute);
  yield takeEvery(actionTypes.DELETE_REQUEST, deleteRoute);
}
