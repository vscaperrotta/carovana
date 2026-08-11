/*
 *
 * TripMap
 *
 */

import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import PlacePopup from './PlacePopup';
import { formatDistance, formatDuration } from '@utils/route';
import './TripMap.scss';

const DEFAULT_CENTER = [43.5, 12.5];
const DEFAULT_ZOOM = 5;

function buildIcon(type, isTopVoted, price, voteCount) {
  const hasLabel = price != null || voteCount > 0;
  const label = hasLabel
    ? `<span class="map-pin-label">${price != null ? `<span class="map-pin-label__price">€${price}</span>` : ''}${
        voteCount > 0 ? `<span class="map-pin-label__votes">♥${voteCount}</span>` : ''
      }</span>`
    : '';
  const pin = `<span class="map-pin map-pin--${type}${isTopVoted ? ' map-pin--top' : ''}"><span class="map-pin__glyph"></span></span>`;
  const html = `<span class="map-pin-stack">${label}${pin}</span>`;
  return L.divIcon({
    html,
    className: 'map-pin-wrapper',
    iconSize: hasLabel ? [56, 58] : [30, 38],
    iconAnchor: hasLabel ? [28, 56] : [15, 36],
    popupAnchor: hasLabel ? [0, -54] : [0, -34],
  });
}

const FitBounds = ({ places }) => {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;
    if (places.length === 1) {
      map.setView([places[0].lat, places[0].lng], 13);
      return;
    }
    const bounds = L.latLngBounds(places.map((place) => [place.lat, place.lng]));
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places.length]);

  return null;
};

FitBounds.propTypes = {
  places: PropTypes.array.isRequired,
};

const ClickHandler = ({ active, onPick }) => {
  useMapEvents({
    click(event) {
      if (active) onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
};

ClickHandler.propTypes = {
  active: PropTypes.bool,
  onPick: PropTypes.func.isRequired,
};

const RouteLine = ({ route }) => {
  const [hovered, setHovered] = useState(false);
  const info = `${formatDistance(route.distanceMeters)} · ${formatDuration(route.durationSeconds)}`;

  return (
    <Polyline
      positions={route.geometry}
      pathOptions={{
        color: '#38bdf8',
        weight: hovered ? 6 : 4,
        opacity: hovered ? 1 : 0.85,
      }}
      eventHandlers={{
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false),
      }}
    >
      <Tooltip sticky className="route-tooltip">
        {info}
      </Tooltip>
      <Popup>{info}</Popup>
    </Polyline>
  );
};

RouteLine.propTypes = {
  route: PropTypes.object.isRequired,
};

const TripMap = ({ tripId, places, routes, pickMode, onPick }) => {
  const topVotedId = useMemo(() => {
    let best = null;
    let bestCount = 0;
    for (const place of places) {
      const count = Object.keys(place.votes || {}).length;
      if (count > bestCount) {
        bestCount = count;
        best = place.id;
      }
    }
    return bestCount > 0 ? best : null;
  }, [places]);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className={`trip-map${pickMode ? ' trip-map--picking' : ''}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds places={places} />
      <ClickHandler active={pickMode} onPick={onPick} />
      {routes.map((route) => (
        <RouteLine key={route.id} route={route} />
      ))}
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={buildIcon(
            place.type,
            place.id === topVotedId,
            place.price,
            Object.keys(place.votes || {}).length,
          )}
        >
          <Popup minWidth={200}>
            <PlacePopup tripId={tripId} place={place} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

TripMap.propTypes = {
  tripId: PropTypes.string.isRequired,
  places: PropTypes.array.isRequired,
  routes: PropTypes.array,
  pickMode: PropTypes.bool,
  onPick: PropTypes.func.isRequired,
};

TripMap.defaultProps = {
  routes: [],
};

export default TripMap;
