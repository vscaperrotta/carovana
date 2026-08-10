/*
 *
 * AppHeader
 *
 */

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './AppHeader.scss';

const AppHeader = ({ children }) => (
  <header className="app-header">
    <div className="container app-header__inner">
      <Link to="/" className="app-header__wordmark">
        Carovana
      </Link>
      {children && <div className="app-header__slot">{children}</div>}
    </div>
  </header>
);

AppHeader.propTypes = {
  children: PropTypes.node,
};

export default AppHeader;
