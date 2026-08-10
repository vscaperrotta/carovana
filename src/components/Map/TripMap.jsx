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

function buildIcon(type, isTopVoted) {
  const html = `<span class="map-pin map-pin--${type}${isTopVoted ? ' map-pin--top' : ''}"><span class="map-pin__glyph"></span></span>`;
  return L.divIcon({
    html,
    className: 'map-pin-wrapper',
    iconSize: [30, 38],
    iconAnchor: [15, 36],
    popupAnchor: [0, -34],
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
          icon={buildIcon(place.type, place.id === topVotedId)}
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
