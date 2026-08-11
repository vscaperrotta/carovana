/*
 *
 * TripMap
 *
 */

import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import PlacePopup from './PlacePopup';
import './TripMap.scss';

const DEFAULT_CENTER = [43.5, 12.5];
const DEFAULT_ZOOM = 5;

const HEART_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"/></svg>';

function buildIcon(type, isTopVoted, price, voteCount) {
  const hasLabel = price != null || voteCount > 0;
  const label = hasLabel
    ? `<span class="map-pin-label">${price != null ? `<span class="map-pin-label__price">€${price}</span>` : ''}${
        voteCount > 0 ? `<span class="map-pin-label__votes">${HEART_SVG}${voteCount}</span>` : ''
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

const TripMap = ({ tripId, places, pickMode, onPick }) => {
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
  pickMode: PropTypes.bool,
  onPick: PropTypes.func.isRequired,
};

export default TripMap;
