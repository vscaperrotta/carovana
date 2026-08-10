/*
 *
 * Trip Route
 *
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GripVertical, MapPinned, Users } from 'lucide-react';
import AppHeader from '@components/Layout';
import PersonBadge from '@components/PersonBadge';
import TripMap from '@components/Map';
import IdentityGate from '@components/IdentityGate';
import TripMenu from '@components/TripMenu';
import { subscribeTrip } from '@store/actions/trip';
import { subscribePeople } from '@store/actions/people';
import { subscribePlaces } from '@store/actions/places';
import { loadIdentity, clearIdentity } from '@store/actions/identity';
import { reverseGeocodeRequest } from '@store/actions/geocode';
import {
  selectTrip,
  selectTripLoading,
  selectTripNotFound,
  selectPeople,
  selectPlaces,
  selectMe,
  selectReverseGeocode,
} from '@store/selectors';
import { t } from '@utils/i18n';
import PlacesPanel from './PlacesPanel';
import PeoplePanel from './PeoplePanel';
import './Trip.scss';

const Trip = () => {
  const { tripId } = useParams();
  const dispatch = useDispatch();

  const trip = useSelector(selectTrip);
  const loading = useSelector(selectTripLoading);
  const notFound = useSelector(selectTripNotFound);
  const people = useSelector(selectPeople);
  const places = useSelector(selectPlaces);
  const me = useSelector(selectMe);
  const reverse = useSelector(selectReverseGeocode);

  const [tab, setTab] = useState('places');
  const [pickMode, setPickMode] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [panelWidth, setPanelWidth] = useState(null);
  const draggingRef = useRef(false);

  const startResize = useCallback((e) => {
    e.preventDefault();
    draggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const width = window.innerWidth - e.clientX;
      setPanelWidth(Math.min(720, Math.max(320, width)));
    };
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    if (!tripId) return;
    dispatch(subscribeTrip(tripId));
    dispatch(subscribePeople(tripId));
    dispatch(subscribePlaces(tripId));
    dispatch(loadIdentity(tripId));
  }, [dispatch, tripId]);

  // Fill the pending pin's address once the reverse geocode resolves.
  useEffect(() => {
    if (!reverse) return;
    setPendingLocation((prev) =>
      prev && prev.lat === reverse.lat && prev.lng === reverse.lng
        ? { ...prev, address: reverse.address }
        : prev,
    );
  }, [reverse]);

  const handlePick = useCallback(
    (lat, lng) => {
      setPendingLocation({ lat, lng, address: null });
      setPickMode(false);
      dispatch(reverseGeocodeRequest({ lat, lng }));
    },
    [dispatch],
  );

  if (notFound) {
    return (
      <>
        <AppHeader />
        <main className="container trip-notfound">
          <h1>{t('trip.notFoundTitle')}</h1>
          <p>{t('trip.notFoundBody')}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader>
        {trip && (
          <>
            <h1 className="font-display trip-header__name">{trip.name}</h1>
            <TripMenu trip={trip} redirectOnDelete />
          </>
        )}
        {me && (
          <button
            type="button"
            className="trip-header__identity"
            onClick={() => dispatch(clearIdentity(tripId))}
          >
            <PersonBadge person={me} size="sm" showName />
            <span className="text-sm trip-header__change">{t('trip.change')}</span>
          </button>
        )}
      </AppHeader>

      {!loading && trip && (
        <div className="trip-layout">
          <div className="trip-layout__map">
            <TripMap tripId={tripId} places={places} pickMode={pickMode} onPick={handlePick} />
          </div>

          <div
            className="trip-layout__panel"
            style={
              panelWidth && window.innerWidth > 1024
                ? { flexBasis: `${panelWidth}px` }
                : undefined
            }
          >
            <div
              className="trip-layout__resizer"
              onMouseDown={startResize}
              role="separator"
              aria-orientation="vertical"
            >
              <span className="trip-layout__resizer-grip">
                <GripVertical size={14} strokeWidth={2} aria-hidden="true" />
              </span>
            </div>
            <IdentityGate people={people} tripId={tripId} />

            <div className="trip-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'places'}
                className={`trip-tabs__tab${tab === 'places' ? ' is-active' : ''}`}
                onClick={() => setTab('places')}
              >
                <MapPinned size={16} strokeWidth={2} aria-hidden="true" />
                {t('trip.places')}
                <span className="trip-tabs__count">{places.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'people'}
                className={`trip-tabs__tab${tab === 'people' ? ' is-active' : ''}`}
                onClick={() => setTab('people')}
              >
                <Users size={16} strokeWidth={2} aria-hidden="true" />
                {t('trip.people')}
                <span className="trip-tabs__count">{people.length}</span>
              </button>
            </div>

            <div className="trip-layout__panel-body">
              {tab === 'places' ? (
                <PlacesPanel
                  tripId={tripId}
                  places={places}
                  pickMode={pickMode}
                  setPickMode={setPickMode}
                  pendingLocation={pendingLocation}
                  setPendingLocation={setPendingLocation}
                />
              ) : (
                <PeoplePanel tripId={tripId} people={people} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Trip;
