/*
 *
 * PeoplePanel
 *
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@components/Button';
import PersonBadge from '@components/PersonBadge';
import { addPersonRequest } from '@store/actions/people';
import { selectMe } from '@store/selectors';
import { t } from '@utils/i18n';

const PeoplePanel = ({ tripId, people }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const adding = useSelector((state) => state.people.adding);
  const error = useSelector((state) => state.people.error);
  const [name, setName] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || adding) return;
    dispatch(addPersonRequest({ tripId, name: trimmed, claim: !me }));
    setName('');
  }

  return (
    <div className="people-panel">
      {people.length === 0 ? (
        <p className="people-panel__empty text-sm">{t('people.empty')}</p>
      ) : (
        <ul className="people-panel__list">
          {people.map((person) => (
            <li key={person.id} className="people-panel__row">
              <PersonBadge person={person} showName />
              {me?.id === person.id && <span className="people-panel__you">{t('people.you')}</span>}
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
    </div>
  );
};

PeoplePanel.propTypes = {
  tripId: PropTypes.string.isRequired,
  people: PropTypes.array.isRequired,
};

export default PeoplePanel;
