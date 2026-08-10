/*
 *
 * Modal
 *
 */

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { t } from '@utils/i18n';
import './Modal.scss';

const Modal = ({ open, onClose, title, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
    >
      <div className="modal__panel">
        <div className="modal__header">
          <h2>{title}</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label={t('modal.close')}
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </dialog>
  );
};

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Modal;
