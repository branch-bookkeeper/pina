import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const propTypes = {
    onRemoveFromBranchQueue: PropTypes.func,
    open: PropTypes.bool,
    anchorEl: PropTypes.object,
    onClose: PropTypes.func,
};

const QueueItemMenu = ({
    onRemoveFromBranchQueue,
    open,
    anchorEl,
    onClose,
}) => (
    <Menu open={open} anchorEl={anchorEl} onClose={onClose}>
        <MenuItem
            onClick={() => {
                onClose();
                onRemoveFromBranchQueue();
            }}
        >
            Remove from queue
        </MenuItem>
    </Menu>
);

QueueItemMenu.propTypes = propTypes;

export default QueueItemMenu;
