/*
 *
 * PlacePopup
 *
 */

import PropTypes from 'prop-types';
import { ExternalLink } from 'lucide-react';
import VoteButton from '@components/PlaceCard/VoteButton';
import { t } from '@utils/i18n';

const PlacePopup = ({ tripId, place }) => (
  <div className="map-popup">
    <p className="map-popup__title">{place.title}</p>
    {place.address && <p className="map-popup__address">{place.address}</p>}
    <div className="map-popup__row">
      <VoteButton tripId={tripId} place={place} />
      {place.url && (
        <a href={place.url} target="_blank" rel="noopener noreferrer" className="map-popup__link">
          <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
          {t('places.openLink')}
        </a>
      )}
    </div>
  </div>
);

PlacePopup.propTypes = {
  tripId: PropTypes.string.isRequired,
  place: PropTypes.object.isRequired,
};

export default PlacePopup;
