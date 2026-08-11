/*
 *
 * RoutesPanel
 *
 */

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@components/Button';
import { addRouteRequest, deleteRouteRequest } from '@store/actions/routes';
import { selectMe, selectRoutesAdding, selectRoutesError, selectRoutesSavedToken, selectOrsQuota } from '@store/selectors';
import { t } from '@utils/i18n';

function formatDistance(meters) {
  return t('routes.distance', { km: (meters / 1000).toFixed(1) });
}

function formatDuration(seconds) {
  return t('routes.duration', { min: Math.round(seconds / 60) });
}

const RoutesPanel = ({ tripId, places, routes }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const adding = useSelector(selectRoutesAdding);
  const error = useSelector(selectRoutesError);
  const savedToken = useSelector(selectRoutesSavedToken);
  const quota = useSelector(selectOrsQuota);

  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');

  const tokenAtMount = useRef(savedToken);
  useEffect(() => {
    if (savedToken !== tokenAtMount.current) {
      tokenAtMount.current = savedToken;
      setFromId('');
      setToId('');
    }
  }, [savedToken]);

  function handleSubmit(event) {
    event.preventDefault();
    const fromPlace = places.find((place) => place.id === fromId);
    const toPlace = places.find((place) => place.id === toId);
    if (!me || !fromPlace || !toPlace || fromPlace.id === toPlace.id || adding) return;
    dispatch(
      addRouteRequest({
        tripId,
        fromPlace,
        toPlace,
        addedBy: me.id,
        addedByName: me.name,
      }),
    );
  }

  function handleDelete(route) {
    if (window.confirm(t('routes.removeConfirm'))) {
      dispatch(deleteRouteRequest({ tripId, routeId: route.id }));
    }
  }

  const placeTitle = (placeId) => places.find((place) => place.id === placeId)?.title ?? '?';
  const quotaLow = quota.remaining != null && quota.limit != null && quota.remaining / quota.limit < 0.1;
  const stays = places.filter((place) => place.type === 'stay');
  const pois = places.filter((place) => place.type === 'poi');

  return (
    <div className="routes-panel">
      <form className="routes-panel__form" onSubmit={handleSubmit}>
        <label>
          {t('routes.fromLabel')}
          <select value={fromId} onChange={(event) => setFromId(event.target.value)} required>
            <option value="" disabled>
              {t('routes.fromLabel')}
            </option>
            <PlaceOptions stays={stays} pois={pois} />
          </select>
        </label>

        <label>
          {t('routes.toLabel')}
          <select value={toId} onChange={(event) => setToId(event.target.value)} required>
            <option value="" disabled>
              {t('routes.toLabel')}
            </option>
            <PlaceOptions stays={stays} pois={pois} />
          </select>
        </label>

        {error && <p className="routes-panel__error text-sm">{error}</p>}
        {quotaLow && (
          <p className="routes-panel__quota-warning text-sm">
            {t('routes.quotaLow', { remaining: quota.remaining })}
          </p>
        )}

        <Button type="submit" variant="primary" disabled={!me || !fromId || !toId || fromId === toId || adding}>
          {adding ? t('routes.submitting') : t('routes.submit')}
        </Button>

        {!me && <p className="text-sm routes-panel__hint">{t('addPlace.hint')}</p>}
      </form>

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
              <button
                type="button"
                className="routes-panel__delete"
                onClick={() => handleDelete(route)}
                aria-label={t('routes.removeAria')}
              >
                <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const PlaceOptions = ({ stays, pois }) => (
  <>
    {stays.length > 0 && (
      <optgroup label={t('places.sectionStays')}>
        {stays.map((place) => (
          <option key={place.id} value={place.id}>
            {place.title}
          </option>
        ))}
      </optgroup>
    )}
    {pois.length > 0 && (
      <optgroup label={t('places.sectionPois')}>
        {pois.map((place) => (
          <option key={place.id} value={place.id}>
            {place.title}
          </option>
        ))}
      </optgroup>
    )}
  </>
);

PlaceOptions.propTypes = {
  stays: PropTypes.array.isRequired,
  pois: PropTypes.array.isRequired,
};

RoutesPanel.propTypes = {
  tripId: PropTypes.string.isRequired,
  places: PropTypes.array.isRequired,
  routes: PropTypes.array.isRequired,
};

export default RoutesPanel;
