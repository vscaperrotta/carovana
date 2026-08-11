/*
 *
 * TripMenu
 *
 */

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import Button from '@components/Button';
import Modal from '@components/Modal';
import DateRangePicker from '@components/DatePicker';
import {
  renameTripRequest,
  deleteTripRequest,
  clearTripActionError,
} from '@store/actions/trips';
import {
  selectTripRenaming,
  selectTripRenameError,
  selectTripRenamedToken,
  selectTripDeleting,
  selectTripDeleteError,
  selectTripDeletedToken,
  selectTripDeletedId,
} from '@store/selectors';
import { t } from '@utils/i18n';
import './TripMenu.scss';

const TripMenu = ({ trip, redirectOnDelete = false }) => {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deletedToken = useSelector(selectTripDeletedToken);
  const deletedId = useSelector(selectTripDeletedId);
  const seenDeleteToken = useRef(deletedToken);

  useEffect(() => {
    if (deletedToken === seenDeleteToken.current) return;
    seenDeleteToken.current = deletedToken;
    if (redirectOnDelete && deletedId === trip.id) navigate('/');
  }, [deletedToken, deletedId, redirectOnDelete, trip.id, navigate]);

  // Manual dropdown (not the Popover API): a popover promotes to the top
  // layer, where `position: absolute` resolves against the viewport instead
  // of the nearest positioned ancestor, so it can't anchor under the trigger.
  useEffect(() => {
    if (!menuOpen) return;
    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setMenuOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="trip-menu" ref={rootRef}>
      <button
        type="button"
        className="trip-menu__trigger"
        aria-label={t('tripMenu.aria')}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={(event) => {
          event.stopPropagation();
          setMenuOpen((isOpen) => !isOpen);
        }}
      >
        <MoreVertical size={18} strokeWidth={2} aria-hidden="true" />
      </button>

      {menuOpen && (
        <div className="trip-menu__dropdown" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen(false);
              setRenameOpen(true);
            }}
          >
            <Pencil size={16} strokeWidth={2} aria-hidden="true" />
            {t('tripMenu.rename')}
          </button>
          <button
            type="button"
            role="menuitem"
            className="trip-menu__item--danger"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen(false);
              setDeleteOpen(true);
            }}
          >
            <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
            {t('tripMenu.delete')}
          </button>
        </div>
      )}

      <RenameTripModal trip={trip} open={renameOpen} onClose={() => setRenameOpen(false)} />
      <DeleteTripModal trip={trip} open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </div>
  );
};

const RenameTripModal = ({ trip, open, onClose }) => {
  const dispatch = useDispatch();
  const renaming = useSelector(selectTripRenaming);
  const error = useSelector(selectTripRenameError);
  const renamedToken = useSelector(selectTripRenamedToken);
  const [name, setName] = useState(trip.name);
  const [startDate, setStartDate] = useState(trip.startDate || '');
  const [endDate, setEndDate] = useState(trip.endDate || '');
  const seenToken = useRef(renamedToken);

  useEffect(() => {
    if (!open) return;
    setName(trip.name);
    setStartDate(trip.startDate || '');
    setEndDate(trip.endDate || '');
  }, [open, trip.name, trip.startDate, trip.endDate]);

  useEffect(() => {
    if (renamedToken === seenToken.current) return;
    seenToken.current = renamedToken;
    onClose();
  }, [renamedToken, onClose]);

  function handleClose() {
    dispatch(clearTripActionError());
    onClose();
  }

  const unchanged =
    name.trim() === trip.name && startDate === (trip.startDate || '') && endDate === (trip.endDate || '');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || unchanged || renaming) return;
    dispatch(renameTripRequest({ tripId: trip.id, name: trimmed, startDate, endDate }));
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('tripMenu.renameTitle')}>
      <form className="rename-trip-form" onSubmit={handleSubmit}>
        <label>
          {t('home.nameLabel')}
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={60}
            autoFocus
          />
        </label>

        <DateRangePicker
          startLabel={t('home.dateFrom')}
          endLabel={t('home.dateTo')}
          start={startDate}
          end={endDate}
          onChangeStart={setStartDate}
          onChangeEnd={setEndDate}
        />

        {error && <p className="rename-trip-form__error">{error}</p>}

        <Button type="submit" variant="primary" disabled={!name.trim() || unchanged || renaming}>
          {renaming ? t('tripMenu.renaming') : t('tripMenu.renameSubmit')}
        </Button>
      </form>
    </Modal>
  );
};

const DeleteTripModal = ({ trip, open, onClose }) => {
  const dispatch = useDispatch();
  const deleting = useSelector(selectTripDeleting);
  const error = useSelector(selectTripDeleteError);
  const deletedToken = useSelector(selectTripDeletedToken);
  const [confirmText, setConfirmText] = useState('');
  const seenToken = useRef(deletedToken);

  useEffect(() => {
    if (open) setConfirmText('');
  }, [open]);

  useEffect(() => {
    if (deletedToken === seenToken.current) return;
    seenToken.current = deletedToken;
    onClose();
  }, [deletedToken, onClose]);

  function handleClose() {
    dispatch(clearTripActionError());
    onClose();
  }

  const canDelete = confirmText === trip.name && !deleting;

  function handleSubmit(event) {
    event.preventDefault();
    if (!canDelete) return;
    dispatch(deleteTripRequest({ tripId: trip.id }));
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('tripMenu.deleteTitle')}>
      <form className="delete-trip-form" onSubmit={handleSubmit}>
        <p className="delete-trip-form__warning">{t('tripMenu.deleteWarning')}</p>

        <label>
          {t('tripMenu.deleteConfirmLabel', { name: trip.name })}
          <input
            type="text"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            placeholder={trip.name}
            autoComplete="off"
            autoFocus
          />
        </label>

        {error && <p className="delete-trip-form__error">{error}</p>}

        <Button type="submit" variant="danger" disabled={!canDelete}>
          {deleting ? t('tripMenu.deleting') : t('tripMenu.deleteSubmit')}
        </Button>
      </form>
    </Modal>
  );
};

const tripShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

TripMenu.propTypes = {
  trip: tripShape.isRequired,
  redirectOnDelete: PropTypes.bool,
};

RenameTripModal.propTypes = {
  trip: tripShape.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

DeleteTripModal.propTypes = {
  trip: tripShape.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default TripMenu;
