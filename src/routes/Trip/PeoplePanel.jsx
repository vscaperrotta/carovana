/*
 *
 * PeoplePanel
 *
 */

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@components/Button';
import Modal from '@components/Modal';
import PersonBadge from '@components/PersonBadge';
import {
  addPersonRequest,
  renamePersonRequest,
  deletePersonRequest,
  clearPeopleError,
} from '@store/actions/people';
import {
  selectMe,
  selectPersonRenaming,
  selectPersonRenameError,
  selectPersonRenamedToken,
} from '@store/selectors';
import { t } from '@utils/i18n';

const PeoplePanel = ({ tripId, people }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const adding = useSelector((state) => state.people.adding);
  const error = useSelector((state) => state.people.error);
  const [name, setName] = useState('');
  const [renameTarget, setRenameTarget] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || adding) return;
    dispatch(addPersonRequest({ tripId, name: trimmed, claim: !me }));
    setName('');
  }

  function handleDelete(person) {
    if (window.confirm(t('people.removeConfirm', { name: person.name }))) {
      dispatch(deletePersonRequest({ tripId, personId: person.id }));
    }
  }

  return (
    <div className="people-panel">
      {people.length === 0 ? (
        <p className="people-panel__empty text-sm">{t('people.empty')}</p>
      ) : (
        <ul className="people-panel__list">
          {people.map((person) => (
            <li key={person.id} className="people-panel__row">
              <span className="people-panel__identity">
                <PersonBadge person={person} showName />
                {me?.id === person.id && <span className="people-panel__you">{t('people.you')}</span>}
              </span>
              <span className="people-panel__actions">
                <button
                  type="button"
                  className="people-panel__edit"
                  onClick={() => setRenameTarget(person)}
                  aria-label={t('people.renameAria', { name: person.name })}
                >
                  <Pencil size={16} strokeWidth={2} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="people-panel__delete"
                  onClick={() => handleDelete(person)}
                  aria-label={t('people.removeAria', { name: person.name })}
                >
                  <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <form className="people-panel__form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t('people.placeholder')}
          maxLength={40}
        />
        <Button type="submit" variant="secondary" size="sm" disabled={!name.trim() || adding}>
          <UserPlus size={16} strokeWidth={2} aria-hidden="true" />
          {t('people.add')}
        </Button>
      </form>
      {error && <p className="people-panel__error text-sm">{error}</p>}

      <RenamePersonModal
        tripId={tripId}
        person={renameTarget}
        open={renameTarget != null}
        onClose={() => setRenameTarget(null)}
      />
    </div>
  );
};

const RenamePersonModal = ({ tripId, person, open, onClose }) => {
  const dispatch = useDispatch();
  const renaming = useSelector(selectPersonRenaming);
  const error = useSelector(selectPersonRenameError);
  const renamedToken = useSelector(selectPersonRenamedToken);
  const [name, setName] = useState('');
  const seenToken = useRef(renamedToken);

  useEffect(() => {
    if (open && person) setName(person.name);
  }, [open, person]);

  useEffect(() => {
    if (renamedToken === seenToken.current) return;
    seenToken.current = renamedToken;
    onClose();
  }, [renamedToken, onClose]);

  function handleClose() {
    dispatch(clearPeopleError());
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !person || trimmed === person.name || renaming) return;
    dispatch(renamePersonRequest({ tripId, personId: person.id, name: trimmed }));
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('people.renameTitle')}>
      {person && (
        <form className="rename-person-form" onSubmit={handleSubmit}>
          <label>
            {t('home.nameLabel')}
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              autoFocus
            />
          </label>

          {error && <p className="rename-person-form__error">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            disabled={!name.trim() || name.trim() === person.name || renaming}
          >
            {renaming ? t('people.renaming') : t('people.renameSubmit')}
          </Button>
        </form>
      )}
    </Modal>
  );
};

PeoplePanel.propTypes = {
  tripId: PropTypes.string.isRequired,
  people: PropTypes.array.isRequired,
};

RenamePersonModal.propTypes = {
  tripId: PropTypes.string.isRequired,
  person: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default PeoplePanel;
