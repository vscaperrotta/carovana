/*
 *
 * IdentityModal
 *
 */

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@components/Modal';
import Button from '@components/Button';
import PersonBadge from '@components/PersonBadge';
import { confirmIdentity } from '@store/actions/identity';
import { selectMe, selectDeviceProfiles, selectSessionConfirmed, selectConfirmedToken } from '@store/selectors';
import { t } from '@utils/i18n';
import './IdentityModal.scss';

const IdentityModal = ({ people, tripId, forceOpen, onForceOpenHandled }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const deviceProfiles = useSelector(selectDeviceProfiles);
  const sessionConfirmed = useSelector(selectSessionConfirmed);
  const confirmedToken = useSelector(selectConfirmedToken);
  const adding = useSelector((state) => state.people.adding);
  const error = useSelector((state) => state.people.error);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('picker'); // 'picker' | 'confirm'
  const [name, setName] = useState('');
  const seenTokenRef = useRef(confirmedToken);

  const meIsValid = Boolean(me && people.some((person) => person.id === me.id));

  // Two independent reasons to show up: no valid identity yet for this trip
  // (picker), or a valid one exists but this browser session hasn't
  // reconfirmed it yet (confirm). An explicit "Cambia" click always wins.
  // This only ever *opens* the modal — closing is handled separately below,
  // so a "Cambia" click on an already-valid/confirmed identity doesn't get
  // immediately undone by this same effect re-deriving "nothing to show".
  useEffect(() => {
    if (forceOpen) {
      setMode('picker');
      setOpen(true);
      onForceOpenHandled();
    } else if (!meIsValid) {
      setMode('picker');
      setOpen(true);
    } else if (!sessionConfirmed) {
      setMode('confirm');
      setOpen(true);
    }
    // onForceOpenHandled is a fresh function identity every parent render;
    // it has no stale-closure risk (always just flips a boolean), so it's
    // deliberately left out of the deps to avoid re-running on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceOpen, meIsValid, sessionConfirmed]);

  // Close once a confirmIdentity dispatch has actually resolved (token
  // bump), regardless of what meIsValid/sessionConfirmed already were
  // before that dispatch — see the token comment in the identity reducer.
  useEffect(() => {
    if (confirmedToken === seenTokenRef.current) return;
    seenTokenRef.current = confirmedToken;
    setOpen(false);
  }, [confirmedToken]);

  const suggestedName = deviceProfiles[0]?.name;
  const matchedPerson = suggestedName
    ? people.find((person) => person.name.trim().toLowerCase() === suggestedName.toLowerCase())
    : null;

  // Prime the add-new input when the picker opens, so confirming your
  // remembered name is one tap instead of retyping it in a new trip.
  // `people`/`deviceProfiles` can still be loading when `open` first flips
  // true, so this re-evaluates as they arrive rather than firing once and
  // going stale — using the functional setState form (not reading `name`
  // in the effect) so it never clobbers text the user already typed.
  useEffect(() => {
    if (!open || mode !== 'picker') return;
    if (matchedPerson) {
      setName('');
      return;
    }
    setName((current) => current || suggestedName || '');
  }, [open, mode, matchedPerson, suggestedName]);

  function handleConfirmYes() {
    dispatch(confirmIdentity({ tripId, personId: me.id, name: me.name, isNew: false }));
  }

  function handleClaim(person) {
    dispatch(confirmIdentity({ tripId, personId: person.id, name: person.name, isNew: false }));
  }

  function handleAddSelf(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || adding) return;
    dispatch(confirmIdentity({ tripId, personId: null, name: trimmed, isNew: true }));
    setName('');
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title={mode === 'confirm' ? t('identity.confirmTitle') : t('identity.title')}
    >
      {mode === 'confirm' && me ? (
        <div className="identity-modal__confirm">
          <PersonBadge person={me} size="md" showName />
          <div className="identity-modal__confirm-actions">
            <Button type="button" variant="primary" onClick={handleConfirmYes}>
              {t('identity.confirmYes')}
            </Button>
            <button type="button" className="identity-modal__confirm-no" onClick={() => setMode('picker')}>
              {t('identity.confirmNo')}
            </button>
          </div>
        </div>
      ) : (
        <div className="identity-modal__picker" aria-label={t('identity.ariaLabel')}>
          <p className="text-sm">{t('identity.subtitle')}</p>

          {people.length > 0 && (
            <ul className="identity-modal__people">
              {people.map((person) => {
                const isSuggested = matchedPerson?.id === person.id;
                return (
                  <li key={person.id}>
                    <button
                      type="button"
                      className={`identity-modal__person${isSuggested ? ' identity-modal__person--suggested' : ''}`}
                      onClick={() => handleClaim(person)}
                    >
                      <PersonBadge person={person} size="sm" showName />
                      {isSuggested && (
                        <span className="identity-modal__suggested-hint">{t('identity.suggestedHint')}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <form className="identity-modal__form" onSubmit={handleAddSelf}>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('identity.namePlaceholder')}
              aria-label={t('identity.nameAria')}
              maxLength={40}
            />
            <Button type="submit" variant="primary" size="sm" disabled={!name.trim() || adding}>
              {t('identity.claim')}
            </Button>
          </form>
          {error && <p className="identity-modal__error text-sm">{error}</p>}
        </div>
      )}
    </Modal>
  );
};

IdentityModal.propTypes = {
  people: PropTypes.array.isRequired,
  tripId: PropTypes.string.isRequired,
  forceOpen: PropTypes.bool,
  onForceOpenHandled: PropTypes.func.isRequired,
};

export default IdentityModal;
