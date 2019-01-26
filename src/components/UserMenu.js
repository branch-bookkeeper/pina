import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const propTypes = {
    onOpenSettings: PropTypes.func,
    onLogout: PropTypes.func,
    open: PropTypes.bool,
    anchorEl: PropTypes.object,
    anchorOrigin: PropTypes.object,
    onClose: PropTypes.func,
};

const UserMenu = ({
    onOpenSettings,
    onLogout,
    open,
    anchorEl,
    anchorOrigin,
    onClose,
}) => (
    <Menu open={open} anchorEl={anchorEl} anchorOrigin={anchorOrigin} onClose={onClose}>
        <MenuItem
            onClick={() => {
                onClose();
                onOpenSettings();
            }}
        >
            Settings
        </MenuItem>
        <MenuItem
            onClick={() => {
                onClose();
                onLogout();
            }}
        >
            Logout
        </MenuItem>
    </Menu>
);

UserMenu.propTypes = propTypes;

export default UserMenu;
