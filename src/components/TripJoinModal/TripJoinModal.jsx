/*
 *
 * TripJoinModal
 *
 * "Am I in this trip's people list?" — separate from the session identity
 * (see IdentityBadge). Opens only when the session identity has no matching
 * Person in this trip yet; closes itself the moment `selectMe` resolves,
 * however that happened (a fresh match, a join, a rename).
 */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@components/Modal';
import Button from '@components/Button';
import PersonBadge from '@components/PersonBadge';
import { joinTrip } from '@store/actions/identity';
import { selectMe, selectIdentityProfile, selectIdentityLoading, selectPeopleLoading } from '@store/selectors';
import { t } from '@utils/i18n';
import './TripJoinModal.scss';

const TripJoinModal = ({ people, tripId }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const identityProfile = useSelector(selectIdentityProfile);
  const identityLoading = useSelector(selectIdentityLoading);
  const peopleLoading = useSelector(selectPeopleLoading);
  const adding = useSelector((state) => state.people.adding);
  const error = useSelector((state) => state.people.error);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  // Never opens before both `people` and the session identity have loaded —
  // otherwise every trip load would flash this open for someone who's
  // already a match, then close it once the data catches up.
  useEffect(() => {
    if (me) {
      setOpen(false);
      return;
    }
    if (peopleLoading || identityLoading) return;
    setOpen(true);
  }, [me, peopleLoading, identityLoading]);

  const knownName = identityProfile?.name;

  // Prime the input with the session identity's name, so confirming it is
  // one tap instead of retyping — re-evaluates as it loads rather than
  // firing once and going stale, using the functional form so it never
  // clobbers text already typed.
  useEffect(() => {
    if (!open) return;
    setName((current) => current || knownName || '');
  }, [open, knownName]);

  function handlePick(personName) {
    dispatch(joinTrip({ tripId, name: personName }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || adding) return;
    dispatch(joinTrip({ tripId, name: trimmed }));
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} title={t('identity.joinTitle')}>
      <div className="trip-join-modal__picker" aria-label={t('identity.ariaLabel')}>
        <p className="text-sm">{t('identity.joinSubtitle')}</p>

        {people.length > 0 && (
          <ul className="trip-join-modal__people">
            {people.map((person) => (
              <li key={person.id}>
                <button type="button" className="trip-join-modal__person" onClick={() => handlePick(person.name)}>
                  <PersonBadge person={person} size="sm" showName />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form className="trip-join-modal__form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('identity.namePlaceholder')}
            aria-label={t('identity.nameAria')}
            maxLength={40}
          />
          <Button type="submit" variant="primary" size="sm" disabled={!name.trim() || adding}>
            {name.trim() ? t('identity.joinAs', { name: name.trim() }) : t('identity.claim')}
          </Button>
        </form>
        {error && <p className="trip-join-modal__error text-sm">{error}</p>}
      </div>
    </Modal>
  );
};

TripJoinModal.propTypes = {
  people: PropTypes.array.isRequired,
  tripId: PropTypes.string.isRequired,
};

export default TripJoinModal;
