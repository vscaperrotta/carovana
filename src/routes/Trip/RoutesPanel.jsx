/*
 *
 * RoutesPanel
 *
 */

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectOrsQuota } from '@store/selectors';
import { t } from '@utils/i18n';
import { formatDistance, formatDuration } from '@utils/route';

const RoutesPanel = ({ places, routes }) => {
  const quota = useSelector(selectOrsQuota);

  const placeTitle = (placeId) => places.find((place) => place.id === placeId)?.title ?? '?';
  const quotaLow = quota.remaining != null && quota.limit != null && quota.remaining / quota.limit < 0.1;

  return (
    <div className="routes-panel">
      {quotaLow && (
        <p className="routes-panel__quota-warning text-sm">
          {t('routes.quotaLow', { remaining: quota.remaining })}
        </p>
      )}

      {routes.length === 0 ? (
        <p className="routes-panel__empty text-sm">{t('routes.empty')}</p>
      ) : (
        <ul className="routes-panel__list">
          {routes.map((route) => (
            <li key={route.id} className="routes-panel__item">
              <div className="routes-panel__item-body">
                <span className="routes-panel__item-title">
                  {placeTitle(route.fromPlaceId)} → {placeTitle(route.toPlaceId)}
                </span>
                <span className="text-sm routes-panel__item-meta">
                  {formatDistance(route.distanceMeters)} · {formatDuration(route.durationSeconds)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

RoutesPanel.propTypes = {
  places: PropTypes.array.isRequired,
  routes: PropTypes.array.isRequired,
};

export default RoutesPanel;
