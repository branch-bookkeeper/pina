import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';

const propTypes = {
    username: PropTypes.string.isRequired,
    size: PropTypes.number,
    className: PropTypes.string,
};

const defaultProps = {
    size: 40,
};

const UserAvatar = ({ username, className, size }) => (
    <Avatar
        src={`https://github.com/${username}.png?size=${size*4}`}
        alt={username}
        className={className}
        style={{ width: size, height: size }}
    />
);

UserAvatar.propTypes = propTypes;
UserAvatar.defaultProps = defaultProps;

export default UserAvatar;
