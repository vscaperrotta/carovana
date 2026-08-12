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
import {
  selectMe,
  selectDeviceProfiles,
  selectDeviceProfilesLoading,
  selectConfirmedToken,
  selectPeopleLoading,
} from '@store/selectors';
import { t } from '@utils/i18n';
import './IdentityModal.scss';

const IdentityModal = ({ people, tripId, forceOpen, onForceOpenHandled }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const deviceProfiles = useSelector(selectDeviceProfiles);
  const deviceProfilesLoading = useSelector(selectDeviceProfilesLoading);
  const confirmedToken = useSelector(selectConfirmedToken);
  const peopleLoading = useSelector(selectPeopleLoading);
  const adding = useSelector((state) => state.people.adding);
  const error = useSelector((state) => state.people.error);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const seenTokenRef = useRef(confirmedToken);
  const autoClaimedRef = useRef(false);

  const meIsValid = Boolean(me && people.some((person) => person.id === me.id));
  const suggestedName = deviceProfiles[0]?.name;
  const matchedPerson = suggestedName
    ? people.find((person) => person.name.trim().toLowerCase() === suggestedName.toLowerCase())
    : null;

  // Nothing to do on our own once a valid identity exists. Otherwise: if
  // this device has been here before (a device profile name matches someone
  // already in the trip), silently claim that person instead of asking —
  // that's the whole point of remembering the name. Only fall back to the
  // picker when there's truly nothing to go on. `people`/`deviceProfiles`
  // load async, so we wait for both before deciding "no match" — otherwise
  // every reload would flash the picker open, then auto-claim/close it.
  // An explicit "Cambia" click always wins over all of this.
  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      onForceOpenHandled();
      return;
    }
    if (meIsValid || peopleLoading || deviceProfilesLoading) return;
    if (matchedPerson) {
      if (autoClaimedRef.current) return;
      autoClaimedRef.current = true;
      dispatch(confirmIdentity({ tripId, personId: matchedPerson.id, name: matchedPerson.name, isNew: false }));
      return;
    }
    setOpen(true);
    // onForceOpenHandled is a fresh function identity every parent render;
    // it has no stale-closure risk (always just flips a boolean), so it's
    // deliberately left out of the deps to avoid re-running on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceOpen, meIsValid, peopleLoading, deviceProfilesLoading, matchedPerson, tripId, dispatch]);

  // Close once a confirmIdentity dispatch has actually resolved (token
  // bump), regardless of what meIsValid already was before that dispatch —
  // see the token comment in the identity reducer.
  useEffect(() => {
    if (confirmedToken === seenTokenRef.current) return;
    seenTokenRef.current = confirmedToken;
    setOpen(false);
  }, [confirmedToken]);

  // Prime the add-new input when the picker opens, so confirming your
  // remembered name is one tap instead of retyping it in a new trip.
  // `people`/`deviceProfiles` can still be loading when `open` first flips
  // true, so this re-evaluates as they arrive rather than firing once and
  // going stale — using the functional setState form (not reading `name`
  // in the effect) so it never clobbers text the user already typed.
  useEffect(() => {
    if (!open) return;
    if (matchedPerson) {
      setName('');
      return;
    }
    setName((current) => current || suggestedName || '');
  }, [open, matchedPerson, suggestedName]);

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
    <Modal open={open} onClose={() => setOpen(false)} title={t('identity.title')}>
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
