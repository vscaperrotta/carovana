import test from 'node:test';
import assert from 'node:assert/strict';
import { detectPlaceSource, extractUrl } from '../src/utils/placeLink.js';

test('detects supported booking providers from a shared URL', () => {
  assert.equal(detectPlaceSource('https://www.airbnb.com/rooms/123'), 'airbnb');
  assert.equal(detectPlaceSource('https://www.booking.com/hotel/it/example.html'), 'booking');
  assert.equal(detectPlaceSource('https://example.com/stay'), 'other');
  assert.equal(detectPlaceSource(''), null);
});

test('extracts the first URL from shared clipboard text', () => {
  assert.equal(
    extractUrl('Casa al mare\nhttps://www.airbnb.com/rooms/123?check_in=2026-08-10'),
    'https://www.airbnb.com/rooms/123?check_in=2026-08-10',
  );
  assert.equal(extractUrl('nessun link'), null);
});
