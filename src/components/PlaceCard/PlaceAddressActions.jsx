/*
 *
 * PlaceAddressActions
 *
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Check, Copy, MapPin } from 'lucide-react';
import { t } from '@utils/i18n';

const PlaceAddressActions = ({ place, className }) => {
  const [copied, setCopied] = useState(false);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;

  function handleCopy() {
    navigator.clipboard.writeText(place.address || `${place.lat}, ${place.lng}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <span className={className}>
      <button type="button" onClick={handleCopy}>
        {copied ? (
          <Check size={13} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Copy size={13} strokeWidth={2} aria-hidden="true" />
        )}
        {copied ? t('places.copiedAddress') : t('places.copyAddressAria')}
      </button>
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
        <MapPin size={13} strokeWidth={2} aria-hidden="true" />
        {t('places.openMapsAria')}
      </a>
    </span>
  );
};

PlaceAddressActions.propTypes = {
  place: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default PlaceAddressActions;
