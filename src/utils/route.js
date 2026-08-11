import { t } from '@utils/i18n.js';

export function formatDistance(meters) {
  return t('routes.distance', { km: (meters / 1000).toFixed(1) });
}

export function formatDuration(seconds) {
  return t('routes.duration', { min: Math.round(seconds / 60) });
}
