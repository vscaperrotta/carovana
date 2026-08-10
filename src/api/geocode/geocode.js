// Nominatim (OpenStreetMap) usage policy: light/personal use, max ~1
// request/second, no bulk geocoding. Fine for a friend-group trip board;
// self-host Nominatim or switch provider if this ever needs to scale up.
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

export async function searchAddress(query) {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];
  const url = `${NOMINATIM_BASE}/search?format=jsonv2&limit=5&q=${encodeURIComponent(trimmed)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.map((item) => ({
    label: item.display_name,
    lat: Number.parseFloat(item.lat),
    lng: Number.parseFloat(item.lon),
  }));
}

export async function reverseGeocode(lat, lng) {
  try {
    const url = `${NOMINATIM_BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.display_name ?? null;
  } catch {
    return null;
  }
}
// @generator api:method
