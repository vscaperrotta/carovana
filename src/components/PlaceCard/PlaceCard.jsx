/*
 *
 * PlaceCard
 *
 */

import PropTypes from 'prop-types';
import { ExternalLink, Home, MapPin, Trash2, Trophy } from 'lucide-react';
import { useDispatch } from 'react-redux';
import PersonBadge from '@components/PersonBadge';
import VoteButton from '@components/PlaceCard/VoteButton';
import { deletePlaceRequest } from '@store/actions/places';
import { t } from '@utils/i18n';
import './PlaceCard.scss';

const PlaceCard = ({ tripId, place, isTopVoted }) => {
  const dispatch = useDispatch();

  function handleDelete() {
    if (window.confirm(t('places.removeConfirm', { title: place.title }))) {
      dispatch(deletePlaceRequest({ tripId, placeId: place.id }));
    }
  }

  return (
    <li className={`place-card${isTopVoted ? ' place-card--top' : ''}`}>
      <span className={`place-card__icon place-card__icon--${place.type}`} aria-hidden="true">
        {place.type === 'stay' ? (
          <Home size={16} strokeWidth={2} />
        ) : (
          <MapPin size={16} strokeWidth={2} />
        )}
      </span>

      <div className="place-card__body">
        <div className="place-card__title-row">
          <span className="place-card__title">{place.title}</span>
          {isTopVoted && (
            <span className="place-card__badge">
              <Trophy size={12} strokeWidth={2.5} aria-hidden="true" />
              {t('places.topVoted')}
            </span>
          )}
        </div>
        {place.address && <p className="text-sm place-card__address">{place.address}</p>}
        <div className="place-card__meta">
          <PersonBadge person={{ id: place.addedBy, name: place.addedByName }} size="sm" showName />
          {place.url && (
            <a href={place.url} target="_blank" rel="noopener noreferrer" className="place-card__link">
              <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
              {t('places.openLink')}
            </a>
          )}
        </div>
      </div>

      <div className="place-card__actions">
        <VoteButton tripId={tripId} place={place} />
        <button
          type="button"
          className="place-card__delete"
          onClick={handleDelete}
          aria-label={t('places.removeAria', { title: place.title })}
        >
          <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

PlaceCard.propTypes = {
  tripId: PropTypes.string.isRequired,
  place: PropTypes.object.isRequired,
  isTopVoted: PropTypes.bool,
};

export default PlaceCard;
