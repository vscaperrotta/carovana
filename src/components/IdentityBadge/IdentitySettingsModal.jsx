/*
 *
 * IdentitySettingsModal
 *
 */

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@components/Modal';
import Button from '@components/Button';
import PersonBadge from '@components/PersonBadge';
import { setName } from '@store/actions/identity';
import { selectDeviceProfiles, selectIdentityProfile } from '@store/selectors';
import { t } from '@utils/i18n';
import './IdentityBadge.scss';

const IdentitySettingsModal = ({ open, onClose, tripId }) => {
  const dispatch = useDispatch();
  const profiles = useSelector(selectDeviceProfiles);
  const activeProfile = useSelector(selectIdentityProfile);
  const [name, setNameInput] = useState('');
  const seenProfileRef = useRef(activeProfile);

  useEffect(() => {
    if (open) setNameInput(activeProfile?.name ?? '');
  }, [open, activeProfile]);

  // Close once the identity has actually changed (a fresh RESOLVED payload
  // different from what we last saw), not just because the modal is open.
  useEffect(() => {
    if (activeProfile === seenProfileRef.current) return;
    seenProfileRef.current = activeProfile;
    onClose();
  }, [activeProfile, onClose]);

  function handlePick(pickedName) {
    dispatch(setName({ name: pickedName, tripId }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    dispatch(setName({ name: trimmed, tripId }));
  }

  const otherProfiles = profiles.filter((profile) => profile.id !== activeProfile?.id);

  return (
    <Modal open={open} onClose={onClose} title={t('identity.settingsTitle')}>
      <div className="identity-badge__settings" aria-label={t('identity.ariaLabel')}>
        <p className="text-sm">{t('identity.settingsSubtitle')}</p>

        {otherProfiles.length > 0 && (
          <ul className="identity-badge__profiles">
            {otherProfiles.map((profile) => (
              <li key={profile.id}>
                <button type="button" className="identity-badge__profile" onClick={() => handlePick(profile.name)}>
                  <PersonBadge person={profile} size="sm" showName />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form className="identity-badge__form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder={t('identity.namePlaceholder')}
            aria-label={t('identity.nameAria')}
            maxLength={40}
            autoFocus
          />
          <Button type="submit" variant="primary" size="sm" disabled={!name.trim()}>
            {t('identity.settingsSubmit')}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

IdentitySettingsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  tripId: PropTypes.string,
};

export default IdentitySettingsModal;
