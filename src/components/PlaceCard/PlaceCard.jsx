/*
 *
 * PlaceCard
 *
 */

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ExternalLink, MapPin, Pencil, Search, Trash2, Trophy } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@components/Button';
import Modal from '@components/Modal';
import PersonBadge from '@components/PersonBadge';
import VoteButton from '@components/PlaceCard/VoteButton';
import { deletePlaceRequest, editPlaceRequest, clearPlacesError } from '@store/actions/places';
import { searchAddressRequest, clearAddressSearch } from '@store/actions/geocode';
import {
  selectPlaceEditing,
  selectPlaceEditError,
  selectPlaceEditedToken,
  selectAddressResults,
  selectAddressSearching,
} from '@store/selectors';
import { detectPlaceSource, extractUrl } from '@utils/placeLink';
import { locale, t } from '@utils/i18n';
import './PlaceCard.scss';

const PlaceCard = ({ tripId, place, isTopVoted }) => {
  const dispatch = useDispatch();
  const [editOpen, setEditOpen] = useState(false);

  function handleDelete() {
    if (window.confirm(t('places.removeConfirm', { title: place.title }))) {
      dispatch(deletePlaceRequest({ tripId, placeId: place.id }));
    }
  }

  return (
    <li className={`place-card${isTopVoted ? ' place-card--top' : ''}`}>
      <div className="place-card__body">
        <div className="place-card__title-row">
          <span className="place-card__title">{place.title}</span>
          {place.price != null && (
            <span className="place-card__price">€{place.price.toLocaleString(locale)}</span>
          )}
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
          className="place-card__edit"
          onClick={() => setEditOpen(true)}
          aria-label={t('places.editAria', { title: place.title })}
        >
          <Pencil size={16} strokeWidth={2} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="place-card__delete"
          onClick={handleDelete}
          aria-label={t('places.removeAria', { title: place.title })}
        >
          <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <EditPlaceModal tripId={tripId} place={place} open={editOpen} onClose={() => setEditOpen(false)} />
    </li>
  );
};

const EditPlaceModal = ({ tripId, place, open, onClose }) => {
  const dispatch = useDispatch();
  const editing = useSelector(selectPlaceEditing);
  const error = useSelector(selectPlaceEditError);
  const editedToken = useSelector(selectPlaceEditedToken);
  const addressResults = useSelector(selectAddressResults);
  const addressSearching = useSelector(selectAddressSearching);
  const [title, setTitle] = useState(place.title);
  const [price, setPrice] = useState(place.price ?? '');
  const [url, setUrl] = useState(place.url || '');
  const [query, setQuery] = useState('');
  // Local to this modal — no map-click picking here (a native <dialog> makes
  // the rest of the page, including the map, inert while open), just search.
  const [location, setLocation] = useState({ address: place.address, lat: place.lat, lng: place.lng });
  const seenToken = useRef(editedToken);

  useEffect(() => {
    if (!open) return;
    setTitle(place.title);
    setPrice(place.price ?? '');
    setUrl(place.url || '');
    setLocation({ address: place.address, lat: place.lat, lng: place.lng });
    setQuery('');
  }, [open, place.title, place.price, place.url, place.address, place.lat, place.lng]);

  useEffect(() => {
    dispatch(searchAddressRequest(query));
  }, [dispatch, query]);

  useEffect(() => {
    if (editedToken === seenToken.current) return;
    seenToken.current = editedToken;
    onClose();
  }, [editedToken, onClose]);

  function handleClose() {
    dispatch(clearPlacesError());
    dispatch(clearAddressSearch());
    onClose();
  }

  function pickResult(result) {
    setLocation({ lat: result.lat, lng: result.lng, address: result.label });
    setQuery('');
    dispatch(clearAddressSearch());
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || editing) return;
    dispatch(
      editPlaceRequest({
        tripId,
        placeId: place.id,
        updates: {
          title: trimmed,
          price: price === '' ? null : Number(price),
          url,
          source: detectPlaceSource(url),
          address: location.address,
          lat: location.lat,
          lng: location.lng,
        },
      }),
    );
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('places.editTitle')}>
      <form className="edit-place-form" onSubmit={handleSubmit}>
        <label>
          {t('addPlace.nameLabel')}
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={80}
            autoFocus
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
              const sharedUrl = extractUrl(event.clipboardData.getData('text'));
              if (!sharedUrl) return;
              event.preventDefault();
              setUrl(sharedUrl);
            }}
            placeholder={t('addPlace.linkPlaceholder')}
          />
        </label>

        <div className="edit-place-form__location">
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

          {addressSearching && <p className="text-sm">{t('addPlace.searching')}</p>}

          {addressResults.length > 0 && (
            <ul className="add-place-form__results">
              {addressResults.map((result, index) => (
                <li key={index}>
                  <button type="button" onClick={() => pickResult(result)}>
                    {result.label}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {location.lat != null && (
            <p className="add-place-form__picked text-sm">
              <MapPin size={14} strokeWidth={2} aria-hidden="true" />
              {location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
            </p>
          )}
        </div>

        {error && <p className="edit-place-form__error">{error}</p>}

        <Button type="submit" variant="primary" disabled={!title.trim() || editing}>
          {editing ? t('places.editSaving') : t('places.editSubmit')}
        </Button>
      </form>
    </Modal>
  );
};

PlaceCard.propTypes = {
  tripId: PropTypes.string.isRequired,
  place: PropTypes.object.isRequired,
  isTopVoted: PropTypes.bool,
};

EditPlaceModal.propTypes = {
  tripId: PropTypes.string.isRequired,
  place: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default PlaceCard;
