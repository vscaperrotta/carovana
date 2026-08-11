/*
 *
 * AddPlaceForm
 *
 */

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { LocateFixed, MapPin, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@components/Button';
import { addPlaceRequest } from '@store/actions/places';
import { searchAddressRequest, clearAddressSearch } from '@store/actions/geocode';
import { detectPlaceSource, extractUrl } from '@utils/placeLink';
import {
  selectMe,
  selectAddressResults,
  selectAddressSearching,
  selectPlacesSavedToken,
} from '@store/selectors';
import { t } from '@utils/i18n';

const AddPlaceForm = ({
  tripId,
  pickMode,
  setPickMode,
  pendingLocation,
  setPendingLocation,
  onDone,
}) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const results = useSelector(selectAddressResults);
  const loading = useSelector(selectAddressSearching);
  const adding = useSelector((state) => state.places.adding);
  const error = useSelector((state) => state.places.error);
  const savedToken = useSelector(selectPlacesSavedToken);

  const [type, setType] = useState('stay');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const source = detectPlaceSource(url);

  // React to a successful add (saga bumps savedToken) without awaiting dispatch.
  const tokenAtMount = useRef(savedToken);
  useEffect(() => {
    if (savedToken !== tokenAtMount.current) {
      setTitle('');
      setPrice('');
      setUrl('');
      setQuery('');
      setPendingLocation(null);
      onDone?.();
    }
  }, [savedToken, setPendingLocation, onDone]);

  // Debounced address search lives in the geocode saga.
  useEffect(() => {
    dispatch(searchAddressRequest(query));
  }, [dispatch, query]);

  function pickResult(result) {
    setPendingLocation({ lat: result.lat, lng: result.lng, address: result.label });
    setPickMode(false);
    setQuery('');
    dispatch(clearAddressSearch());
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!me || !pendingLocation || !title.trim() || adding) return;
    dispatch(
      addPlaceRequest({
        tripId,
        place: {
          type,
          title,
          price: price.trim() ? Number(price) : null,
          url,
          source,
          address: pendingLocation.address,
          lat: pendingLocation.lat,
          lng: pendingLocation.lng,
          addedBy: me.id,
          addedByName: me.name,
        },
      }),
    );
  }

  return (
    <form className="add-place-form" onSubmit={handleSubmit}>
      <div className="add-place-form__type" role="radiogroup" aria-label={t('addPlace.typeAria')}>
        <button
          type="button"
          role="radio"
          aria-checked={type === 'stay'}
          className={type === 'stay' ? 'is-active' : ''}
          onClick={() => setType('stay')}
        >
          {t('addPlace.stay')}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={type === 'poi'}
          className={type === 'poi' ? 'is-active' : ''}
          onClick={() => setType('poi')}
        >
          {t('addPlace.poi')}
        </button>
      </div>

      <label>
        {t('addPlace.nameLabel')}
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={type === 'stay' ? t('addPlace.namePlaceholderStay') : t('addPlace.namePlaceholderPoi')}
          maxLength={80}
          required
        />
      </label>

      <label>
        {t('addPlace.priceLabel')}
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="0"
        />
      </label>

      <label>
        {t('addPlace.linkLabel')}
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onPaste={(event) => {
              const sharedText = event.clipboardData.getData('text');
              const sharedUrl = extractUrl(sharedText);
              if (!sharedUrl) return;
              event.preventDefault();
              setUrl(sharedUrl);
              const sharedTitle = sharedText.replace(sharedUrl, '').trim();
              if (!title.trim() && sharedTitle) setTitle(sharedTitle.slice(0, 80));
            }}
            placeholder={t('addPlace.linkPlaceholder')}
          />
        </label>
        {source && source !== 'other' && (
          <p className="text-sm add-place-form__source">{t(`addPlace.source.${source}`)}</p>
        )}

      <div className="add-place-form__location">
        <label>
          {t('addPlace.whereLabel')}
          <div className="add-place-form__search">
            <Search size={16} strokeWidth={2} aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('addPlace.searchPlaceholder')}
            />
          </div>
        </label>

        {loading && <p className="text-sm">{t('addPlace.searching')}</p>}

        {results.length > 0 && (
          <ul className="add-place-form__results">
            {results.map((result, index) => (
              <li key={index}>
                <button type="button" onClick={() => pickResult(result)}>
                  {result.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        <Button
          type="button"
          variant={pickMode ? 'accent' : 'secondary'}
          size="sm"
          onClick={() => setPickMode(!pickMode)}
        >
          <LocateFixed size={16} strokeWidth={2} aria-hidden="true" />
          {pickMode ? t('addPlace.pickOnMapActive') : t('addPlace.pickOnMap')}
        </Button>

        {pendingLocation && (
          <p className="add-place-form__picked text-sm">
            <MapPin size={14} strokeWidth={2} aria-hidden="true" />
            {pendingLocation.address ||
              `${pendingLocation.lat.toFixed(4)}, ${pendingLocation.lng.toFixed(4)}`}
          </p>
        )}
      </div>

      {error && <p className="add-place-form__error text-sm">{error}</p>}

      <Button type="submit" variant="primary" disabled={!me || !pendingLocation || !title.trim() || adding}>
        {adding ? t('addPlace.submitting') : t('addPlace.submit')}
      </Button>

      {!me && (
        <p className="text-sm add-place-form__hint">{t('addPlace.hint')}</p>
      )}
    </form>
  );
};

AddPlaceForm.propTypes = {
  tripId: PropTypes.string.isRequired,
  pickMode: PropTypes.bool,
  setPickMode: PropTypes.func.isRequired,
  pendingLocation: PropTypes.object,
  setPendingLocation: PropTypes.func.isRequired,
  onDone: PropTypes.func,
};

export default AddPlaceForm;
