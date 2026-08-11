/*
 *
 * TripCard
 *
 */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChevronRight, Compass, Users } from 'lucide-react';
import TripMenu from '@components/TripMenu';
import { countPeople } from '@api/people/people';
import { formatDateRange } from '@utils/date';

const TripCard = ({ trip }) => {
  const dateLabel = formatDateRange(trip.startDate, trip.endDate);
  const [peopleCount, setPeopleCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    countPeople(trip.id).then((count) => {
      if (!cancelled) setPeopleCount(count);
    });
    return () => {
      cancelled = true;
    };
  }, [trip.id]);

  return (
    <div className="trip-card">
      <Link to={`/viaggio/${trip.id}`} className="trip-card__link">
        <span className="trip-card__icon" aria-hidden="true">
          <Compass size={20} strokeWidth={2} />
        </span>
        <span className="trip-card__body">
          <span className="trip-card__name">{trip.name}</span>
          <span className="trip-card__meta text-sm">
            {dateLabel && <span className="trip-card__date">{dateLabel}</span>}
            {peopleCount !== null && (
              <span className="trip-card__people">
                <Users size={14} strokeWidth={2} aria-hidden="true" />
                {peopleCount}
              </span>
            )}
          </span>
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
