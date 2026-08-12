/*
 *
 * PlacePopup
 *
 */

import PropTypes from 'prop-types';
import { ExternalLink } from 'lucide-react';
import VoteButton from '@components/PlaceCard/VoteButton';
import PlaceAddressActions from '@components/PlaceCard/PlaceAddressActions';
import { locale, t } from '@utils/i18n';

const PlacePopup = ({ tripId, place }) => (
  <div className="map-popup">
    <div className="map-popup__title-row">
      <p className="map-popup__title">{place.title}</p>
      {place.price != null && (
        <span className="map-popup__price">€{place.price.toLocaleString(locale)}</span>
      )}
    </div>
    <p className="map-popup__address">
      {place.address}
      <PlaceAddressActions place={place} className="map-popup__address-actions" />
    </p>
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
