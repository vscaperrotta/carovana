import { eventChannel } from 'redux-saga';
import { call, cancelled, put, take, takeEvery, takeLatest } from 'redux-saga/effects';
import * as api from '@api/places/places.js';
import * as actions from '@store/actions/places.js';
import { actionTypes } from '@store/actions/places.js';

function createPlacesChannel(tripId) {
  return eventChannel((emit) => api.watchPlaces(tripId, (list) => emit(list)));
}

function* watchPlacesData(action) {
  const tripId = action.payload;
  if (!tripId) return;
  const channel = yield call(createPlacesChannel, tripId);
  try {
    while (true) {
      const list = yield take(channel);
      yield put(actions.placesReceived(list));
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

function* addPlace(action) {
  const { tripId, place } = action.payload;
  try {
    yield call(api.addPlace, tripId, place);
    yield put(actions.addPlaceSuccess());
  } catch (error) {
    yield put(actions.addPlaceFailure(error.message));
  }
}

function* editPlace(action) {
  const { tripId, placeId, updates } = action.payload;
  try {
    yield call(api.editPlace, tripId, placeId, updates);
    yield put(actions.editPlaceSuccess());
  } catch (error) {
    yield put(actions.editPlaceFailure(error.message));
  }
}

function* deletePlace(action) {
  const { tripId, placeId } = action.payload;
  try {
    yield call(api.deletePlace, tripId, placeId);
  } catch (error) {
    yield put(actions.addPlaceFailure(error.message));
  }
}

function* votePlace(action) {
  const { tripId, placeId, personId, hasVoted } = action.payload;
  try {
    yield call(api.toggleVote, tripId, placeId, personId, hasVoted);
  } catch (error) {
    // Voting is best-effort; realtime state stays consistent on next snapshot.
    console.error('Voto non salvato:', error);
  }
}

// @generator saga:method

export default function* placesSaga() {
  yield takeLatest(actionTypes.SUBSCRIBE, watchPlacesData);
  yield takeEvery(actionTypes.ADD_REQUEST, addPlace);
  yield takeEvery(actionTypes.EDIT_REQUEST, editPlace);
  yield takeEvery(actionTypes.DELETE_REQUEST, deletePlace);
  yield takeEvery(actionTypes.VOTE_REQUEST, votePlace);
  // @generator saga:watch
}
