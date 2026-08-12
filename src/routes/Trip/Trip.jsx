/*
 *
 * Trip Route
 *
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GripVertical, MapPinned, Route, Users } from 'lucide-react';
import AppHeader from '@components/Layout';
import TripMap from '@components/Map';
import IdentityBadge from '@components/IdentityBadge';
import TripJoinModal from '@components/TripJoinModal';
import TripMenu from '@components/TripMenu';
import { subscribeTrip } from '@store/actions/trip';
import { subscribePeople } from '@store/actions/people';
import { subscribePlaces } from '@store/actions/places';
import { subscribeRoutes, addRouteRequest } from '@store/actions/routes';
import { loadIdentity } from '@store/actions/identity';
import { reverseGeocodeRequest } from '@store/actions/geocode';
import {
  selectTrip,
  selectTripLoading,
  selectTripNotFound,
  selectPeople,
  selectPlaces,
  selectRoutes,
  selectRoutesAdding,
  selectRoutesError,
  selectReverseGeocode,
} from '@store/selectors';
import { t } from '@utils/i18n';
import PlacesPanel from './PlacesPanel';
import PeoplePanel from './PeoplePanel';
import RoutesPanel from './RoutesPanel';
import './Trip.scss';

const Trip = () => {
  const { tripId } = useParams();
  const dispatch = useDispatch();

  const trip = useSelector(selectTrip);
  const loading = useSelector(selectTripLoading);
  const notFound = useSelector(selectTripNotFound);
  const people = useSelector(selectPeople);
  const places = useSelector(selectPlaces);
  const routes = useSelector(selectRoutes);
  const routesAdding = useSelector(selectRoutesAdding);
  const routesError = useSelector(selectRoutesError);
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
    dispatch(subscribeRoutes(tripId));
    dispatch(loadIdentity());
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

  const visibleRoutes = routes.filter(
    (route) =>
      places.some((place) => place.id === route.fromPlaceId) &&
      places.some((place) => place.id === route.toPlaceId),
  );

  // Session-only "already requested" guard: the Firestore write is async, so
  // routes won't reflect it immediately and the effect below would re-fire
  // for the same stay on every render until it does.
  const autoRequestedStayIdsRef = useRef(new Set());
  const wasAddingRoutesRef = useRef(routesAdding);

  useEffect(() => {
    // ponytail: no per-request correlation id on ADD_FAILURE, so a failed
    // request clears the whole guard set rather than just its own stay.
    // Safe because already-succeeded stays are excluded by the `routes`
    // check below regardless, so this only re-opens retries.
    if (wasAddingRoutesRef.current && !routesAdding && routesError) {
      autoRequestedStayIdsRef.current.clear();
    }
    wasAddingRoutesRef.current = routesAdding;
  }, [routesAdding, routesError]);

  useEffect(() => {
    const pois = places.filter((place) => place.type === 'poi');
    if (pois.length !== 1) return;
    const [poi] = pois;
    const stays = places.filter((place) => place.type === 'stay');
    for (const stay of stays) {
      const hasRoute = routes.some(
        (route) => route.fromPlaceId === stay.id && route.toPlaceId === poi.id,
      );
      if (hasRoute || autoRequestedStayIdsRef.current.has(stay.id)) continue;
      autoRequestedStayIdsRef.current.add(stay.id);
      dispatch(
        addRouteRequest({
          tripId,
          fromPlace: stay,
          toPlace: poi,
          addedBy: poi.addedBy,
          addedByName: poi.addedByName,
        }),
      );
    }
  }, [dispatch, tripId, places, routes]);

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
    <div className="trip-page">
      <AppHeader backTo="/">
        {trip && (
          <>
            <h1 className="font-display trip-header__name">{trip.name}</h1>
            <TripMenu trip={trip} redirectOnDelete />
          </>
        )}
        <span className="trip-header__identity">
          <IdentityBadge tripId={tripId} />
        </span>
      </AppHeader>

      {!loading && trip && (
        <div className="trip-layout">
          <div className="trip-layout__map">
            <TripMap
              tripId={tripId}
              places={places}
              routes={visibleRoutes}
              pickMode={pickMode}
              onPick={handlePick}
            />
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
            <TripJoinModal people={people} tripId={tripId} />

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
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'routes'}
                className={`trip-tabs__tab${tab === 'routes' ? ' is-active' : ''}`}
                onClick={() => setTab('routes')}
              >
                <Route size={16} strokeWidth={2} aria-hidden="true" />
                {t('trip.routes')}
                <span className="trip-tabs__count">{visibleRoutes.length}</span>
              </button>
            </div>

            <div className="trip-layout__panel-body">
              {tab === 'places' && (
                <PlacesPanel
                  tripId={tripId}
                  places={places}
                  pickMode={pickMode}
                  setPickMode={setPickMode}
                  pendingLocation={pendingLocation}
                  setPendingLocation={setPendingLocation}
                />
              )}
              {tab === 'people' && <PeoplePanel tripId={tripId} people={people} />}
              {tab === 'routes' && <RoutesPanel places={places} routes={visibleRoutes} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trip;
