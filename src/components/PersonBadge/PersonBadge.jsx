/*
 *
 * PersonBadge
 *
 */

import PropTypes from 'prop-types';
import { initials, personColor } from '@utils/person';
import './PersonBadge.scss';

const PersonBadge = ({ person, size = 'md', showName = false }) => {
  if (!person) return null;

  return (
    <span className={`person-badge person-badge--${size}`}>
      <span
        className="person-badge__avatar"
        style={{ backgroundColor: personColor(person.id) }}
        aria-hidden="true"
      >
        {initials(person.name)}
      </span>
      {showName && <span className="person-badge__name">{person.name}</span>}
    </span>
  );
};

PersonBadge.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  size: PropTypes.string,
  showName: PropTypes.bool,
};

export default PersonBadge;
