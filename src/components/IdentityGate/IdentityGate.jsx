/*
 *
 * IdentityGate
 *
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { UserRound } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import PersonBadge from '@components/PersonBadge';
import Button from '@components/Button';
import { setIdentity } from '@store/actions/identity';
import { addPersonRequest } from '@store/actions/people';
import { selectMe } from '@store/selectors';
import { t } from '@utils/i18n';
import './IdentityGate.scss';

const IdentityGate = ({ people, tripId }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const adding = useSelector((state) => state.people.adding);
  const error = useSelector((state) => state.people.error);
  const [name, setName] = useState('');

  const meIsValid = me && people.some((p) => p.id === me.id);
  if (meIsValid) return null;

  function handleClaim(person) {
    dispatch(setIdentity({ tripId, person: { id: person.id, name: person.name } }));
  }

  function handleAddSelf(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || adding) return;
    dispatch(addPersonRequest({ tripId, name: trimmed, claim: true }));
    setName('');
  }

  return (
    <section className="identity-gate" aria-label={t('identity.ariaLabel')}>
      <div className="identity-gate__icon">
        <UserRound size={20} strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="identity-gate__body">
        <h2>{t('identity.title')}</h2>
        <p className="text-sm">{t('identity.subtitle')}</p>

        {people.length > 0 && (
          <ul className="identity-gate__people">
            {people.map((person) => (
              <li key={person.id}>
                <button
                  type="button"
                  className="identity-gate__person"
                  onClick={() => handleClaim(person)}
                >
                  <PersonBadge person={person} size="sm" showName />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form className="identity-gate__form" onSubmit={handleAddSelf}>
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
        {error && <p className="identity-gate__error text-sm">{error}</p>}
      </div>
    </section>
  );
};

IdentityGate.propTypes = {
  people: PropTypes.array.isRequired,
  tripId: PropTypes.string.isRequired,
};

export default IdentityGate;
