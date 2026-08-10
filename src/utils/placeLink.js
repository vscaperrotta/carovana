const URL_PATTERN = /https?:\/\/[^\s<>"']+/i;

function parseHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

export function extractUrl(text) {
  const match = text.match(URL_PATTERN);
  if (!match) return null;

  const candidate = match[0].replace(/[.,!?;:)\]}]+$/, '');
  return parseHttpUrl(candidate) ? candidate : null;
}

export function detectPlaceSource(value) {
  const url = parseHttpUrl(value.trim());
  if (!url) return null;

  const { hostname } = url;
  if (hostname === 'airbnb.com' || hostname.endsWith('.airbnb.com')) return 'airbnb';
  if (hostname === 'booking.com' || hostname.endsWith('.booking.com')) return 'booking';
  return 'other';
}
