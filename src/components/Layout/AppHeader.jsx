/*
 *
 * AppHeader
 *
 */

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { t } from '@utils/i18n';
import './AppHeader.scss';

const AppHeader = ({ children, backTo }) => (
  <header className={`app-header${backTo ? ' app-header--has-back' : ''}`}>
    <div className="container app-header__inner">
      <Link to="/" className="app-header__wordmark">
        Carovana
      </Link>
      {backTo && (
        <Link to={backTo} className="app-header__back" aria-label={t('trip.backToList')}>
          <ArrowLeft size={20} strokeWidth={2} aria-hidden="true" />
        </Link>
      )}
      {children && <div className="app-header__slot">{children}</div>}
    </div>
  </header>
);

AppHeader.propTypes = {
  children: PropTypes.node,
  backTo: PropTypes.string,
};

export default AppHeader;
