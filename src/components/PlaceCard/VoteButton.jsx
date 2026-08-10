/*
 *
 * VoteButton
 *
 */

import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { votePlaceRequest } from '@store/actions/places';
import { selectMe } from '@store/selectors';
import { t } from '@utils/i18n';
import './VoteButton.scss';

const VoteButton = ({ tripId, place }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const votes = place.votes || {};
  const count = Object.keys(votes).length;
  const hasVoted = Boolean(me && votes[me.id]);

  function handleClick() {
    if (!me) return;
    dispatch(votePlaceRequest({ tripId, placeId: place.id, personId: me.id, hasVoted }));
  }

  return (
    <button
      type="button"
      className={`vote-button${hasVoted ? ' vote-button--active' : ''}`}
      onClick={handleClick}
      disabled={!me}
      title={me ? undefined : t('vote.hint')}
      aria-pressed={hasVoted}
    >
      <Heart
        size={16}
        strokeWidth={2}
        fill={hasVoted ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
      <span>{count}</span>
    </button>
  );
};

VoteButton.propTypes = {
  tripId: PropTypes.string.isRequired,
  place: PropTypes.object.isRequired,
};

export default VoteButton;
