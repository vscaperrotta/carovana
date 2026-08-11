/*
 *
 * PlaceCard
 *
 */

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ExternalLink, Home, MapPin, Pencil, Trash2, Trophy } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@components/Button';
import Modal from '@components/Modal';
import PersonBadge from '@components/PersonBadge';
import VoteButton from '@components/PlaceCard/VoteButton';
import { deletePlaceRequest, editPlaceRequest, clearPlacesError } from '@store/actions/places';
import { selectPlaceEditing, selectPlaceEditError, selectPlaceEditedToken } from '@store/selectors';
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
  const [title, setTitle] = useState(place.title);
  const [price, setPrice] = useState(place.price ?? '');
  const [url, setUrl] = useState(place.url || '');
  const seenToken = useRef(editedToken);

  useEffect(() => {
    if (!open) return;
    setTitle(place.title);
    setPrice(place.price ?? '');
    setUrl(place.url || '');
  }, [open, place.title, place.price, place.url]);

  useEffect(() => {
    if (editedToken === seenToken.current) return;
    seenToken.current = editedToken;
    onClose();
  }, [editedToken, onClose]);

  function handleClose() {
    dispatch(clearPlacesError());
    onClose();
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
