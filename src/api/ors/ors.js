import { withTimeout } from '@utils/async.js';
import { t } from '@utils/i18n.js';

const ORS_URL = 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson';

export async function fetchWalkingRoute(fromPlace, toPlace) {
  const response = await withTimeout(
    fetch(ORS_URL, {
      method: 'POST',
      headers: {
        Authorization: import.meta.env.VITE_ORS_API_KEY,
        'Content-Type': 'application/json',
      },
      // ORS wants [lng, lat], the opposite of the {lat, lng} order used everywhere else in this app.
      body: JSON.stringify({
        coordinates: [
          [fromPlace.lng, fromPlace.lat],
          [toPlace.lng, toPlace.lat],
        ],
      }),
    }),
    12000,
    t('errors.addRoute'),
  );

  const quota = {
    remaining: Number(response.headers.get('X-Ratelimit-Remaining')) || null,
    limit: Number(response.headers.get('X-Ratelimit-Limit')) || null,
  };

  if (!response.ok) throw new Error(t('errors.addRoute'));

  const data = await response.json();
  const feature = data.features?.[0];
  if (!feature) throw new Error(t('errors.addRoute'));

  return {
    // Firestore doesn't support nested arrays — store as {lat,lng} objects,
    // which Leaflet's Polyline also accepts directly as positions.
    geometry: feature.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
    distanceMeters: feature.properties.summary.distance,
    durationSeconds: feature.properties.summary.duration,
    quota,
  };
}
