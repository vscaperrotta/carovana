/*
 *
 * IdentityBadge
 *
 * "Who am I" — session-wide, shown in the header on every page. Click opens
 * IdentitySettingsModal to set/switch/rename it. Separate from "am I in
 * this trip" (see TripJoinModal), which never touches this component.
 */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserRound } from 'lucide-react';
import { useSelector } from 'react-redux';
import PersonBadge from '@components/PersonBadge';
import { selectIdentityProfile, selectIdentityLoading } from '@store/selectors';
import { t } from '@utils/i18n';
import IdentitySettingsModal from './IdentitySettingsModal';
import './IdentityBadge.scss';

const IdentityBadge = ({ tripId, autoOpenOnFirstVisit = false }) => {
  const profile = useSelector(selectIdentityProfile);
  const profileLoading = useSelector(selectIdentityLoading);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoOpenOnFirstVisit || profileLoading || profile) return;
    setOpen(true);
  }, [autoOpenOnFirstVisit, profileLoading, profile]);

  if (profileLoading) return null;

  return (
    <>
      <button type="button" className="identity-badge" onClick={() => setOpen(true)} aria-label={t('identity.changeAria')}>
        {profile ? (
          <PersonBadge person={profile} size="sm" showName />
        ) : (
          <span className="identity-badge__placeholder">
            <UserRound size={18} strokeWidth={2} aria-hidden="true" />
            {t('identity.setNameCta')}
          </span>
        )}
      </button>
      <IdentitySettingsModal open={open} onClose={() => setOpen(false)} tripId={tripId} />
    </>
  );
};

IdentityBadge.propTypes = {
  tripId: PropTypes.string,
  autoOpenOnFirstVisit: PropTypes.bool,
};

export default IdentityBadge;
