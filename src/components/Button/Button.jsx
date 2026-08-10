/*
 *
 * Button
 *
 */

import PropTypes from 'prop-types';
import './Button.scss';

const Button = ({
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  className = '',
  children,
  ...rest
}) => {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

Button.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.string,
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Button;
