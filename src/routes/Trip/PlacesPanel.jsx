/*
 *
 * PlacesPanel
 *
 */

import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Plus, X } from 'lucide-react';
import Button from '@components/Button';
import PlaceCard from '@components/PlaceCard';
import { t } from '@utils/i18n';
import AddPlaceForm from './AddPlaceForm';

const PlacesPanel = ({ tripId, places, pickMode, setPickMode, pendingLocation, setPendingLocation }) => {
  const [formOpen, setFormOpen] = useState(false);

  const { stays, pois, topVotedId } = useMemo(() => {
    const withCounts = places.map((place) => ({
      place,
      count: Object.keys(place.votes || {}).length,
    }));
    const top = withCounts.reduce(
      (best, current) => (current.count > best.count ? current : best),
      { count: 0, place: null },
    );
    const byVotesDesc = (a, b) => b.count - a.count;
    const byType = (type) =>
      withCounts.filter((entry) => entry.place.type === type).sort(byVotesDesc).map((entry) => entry.place);
    return { stays: byType('stay'), pois: byType('poi'), topVotedId: top.count > 0 ? top.place?.id : null };
  }, [places]);

  function closeForm() {
    setFormOpen(false);
    setPickMode(false);
    setPendingLocation(null);
  }

  return (
    <div className="places-panel">
      <div className="places-panel__toolbar">
        <Button
          type="button"
          variant={formOpen ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => (formOpen ? closeForm() : setFormOpen(true))}
        >
          {formOpen ? (
            <>
              <X size={16} strokeWidth={2.5} aria-hidden="true" />
              {t('places.cancel')}
            </>
          ) : (
            <>
              <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
              {t('places.addPlace')}
            </>
          )}
        </Button>
      </div>

      {formOpen && (
        <AddPlaceForm
          tripId={tripId}
          pickMode={pickMode}
          setPickMode={setPickMode}
          pendingLocation={pendingLocation}
          setPendingLocation={setPendingLocation}
          onDone={closeForm}
        />
      )}

      {places.length === 0 && !formOpen && (
        <p className="places-panel__empty text-sm">{t('places.empty')}</p>
      )}

      {pois.length > 0 && (
        <div className="places-panel__section">
          <h2 className="places-panel__section-title">{t('places.sectionPois')}</h2>
          <ul className="places-panel__list">
            {pois.map((place) => (
              <PlaceCard key={place.id} tripId={tripId} place={place} isTopVoted={place.id === topVotedId} />
            ))}
          </ul>
        </div>
      )}

      {stays.length > 0 && (
        <div className="places-panel__section">
          <h2 className="places-panel__section-title">{t('places.sectionStays')}</h2>
          <ul className="places-panel__list">
            {stays.map((place) => (
              <PlaceCard key={place.id} tripId={tripId} place={place} isTopVoted={place.id === topVotedId} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

PlacesPanel.propTypes = {
  tripId: PropTypes.string.isRequired,
  places: PropTypes.array.isRequired,
  pickMode: PropTypes.bool,
  setPickMode: PropTypes.func.isRequired,
  pendingLocation: PropTypes.object,
  setPendingLocation: PropTypes.func.isRequired,
};

export default PlacesPanel;
