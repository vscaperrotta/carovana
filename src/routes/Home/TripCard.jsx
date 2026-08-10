/*
 *
 * TripCard
 *
 */

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChevronRight, Compass } from 'lucide-react';
import TripMenu from '@components/TripMenu';
import { formatDateRange } from '@utils/date';

const TripCard = ({ trip }) => {
  const dateLabel = formatDateRange(trip.startDate, trip.endDate);

  return (
    <div className="trip-card">
      <Link to={`/viaggio/${trip.id}`} className="trip-card__link">
        <span className="trip-card__icon" aria-hidden="true">
          <Compass size={20} strokeWidth={2} />
        </span>
        <span className="trip-card__body">
          <span className="trip-card__name">{trip.name}</span>
          {dateLabel && <span className="trip-card__date text-sm">{dateLabel}</span>}
        </span>
        <ChevronRight size={20} strokeWidth={2} className="trip-card__chevron" aria-hidden="true" />
      </Link>
      <TripMenu trip={trip} />
    </div>
  );
};

TripCard.propTypes = {
  trip: PropTypes.object.isRequired,
};

export default TripCard;
