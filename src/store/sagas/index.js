import { all } from 'redux-saga/effects';
import trips from '@store/sagas/trips.js';
import trip from '@store/sagas/trip.js';
import people from '@store/sagas/people.js';
import places from '@store/sagas/places.js';
import identity from '@store/sagas/identity.js';
import geocode from '@store/sagas/geocode.js';
// @generator sagas:import

export default function* allSagas() {
  yield all([
    trips(),
    trip(),
    people(),
    places(),
    identity(),
    geocode(),
    // @generator sagas:export
  ]);
}
