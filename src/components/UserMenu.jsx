import React from 'react';
import PropTypes from 'prop-types';
import Menu, { MenuItem } from 'material-ui/Menu';

const propTypes = {
    onOpenSettings: PropTypes.func,
    onLogout: PropTypes.func,
    open: PropTypes.bool,
    anchorEl: PropTypes.object,
    anchorOrigin: PropTypes.object,
    onRequestClose: PropTypes.func,
};

const UserMenu = ({
    onOpenSettings,
    onLogout,
    open,
    anchorEl,
    anchorOrigin,
    onRequestClose,
}) => (
    <Menu open={open} anchorEl={anchorEl} anchorOrigin={anchorOrigin} onRequestClose={onRequestClose}>
        <MenuItem
            onClick={() => {
                onRequestClose();
                onOpenSettings();
            }}
        >
            Settings
        </MenuItem>
        <MenuItem
            onClick={() => {
                onRequestClose();
                onLogout();
            }}
        >
            Logout
        </MenuItem>
    </Menu>
);

UserMenu.propTypes = propTypes;

export default UserMenu;
