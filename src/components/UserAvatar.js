import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';

const propTypes = {
    username: PropTypes.string.isRequired,
    size: PropTypes.number,
    className: PropTypes.string,
    onMouseOver: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchEnd: PropTypes.func,
};

const defaultProps = {
    size: 40,
    onMouseOver: null,
    onMouseLeave: null,
    onTouchStart: null,
    onTouchEnd: null,
};

const UserAvatar = ({
    username,
    className,
    size,
    onMouseOver,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
}) => (
    <Avatar
        src={`https://github.com/${username}.png?size=${size*4}`}
        alt={username}
        className={className}
        style={{ width: size, height: size }}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
    />
);

UserAvatar.propTypes = propTypes;
UserAvatar.defaultProps = defaultProps;

export default UserAvatar;
