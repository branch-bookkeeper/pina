import React from 'react';
import PropTypes from 'prop-types';
import Menu, { MenuItem } from 'material-ui/Menu';

const propTypes = {
    onRemoveFromBranchQueue: PropTypes.func,
    open: PropTypes.bool,
    anchorEl: PropTypes.object,
    onRequestClose: PropTypes.func,
};

const QueueItemMenu = ({
    onRemoveFromBranchQueue,
    open,
    anchorEl,
    onRequestClose,
}) => (
    <Menu open={open} anchorEl={anchorEl} onRequestClose={onRequestClose}>
        <MenuItem
            onClick={() => {
                onRequestClose();
                onRemoveFromBranchQueue();
            }}
        >
            Remove from queue
        </MenuItem>
    </Menu>
);

QueueItemMenu.propTypes = propTypes;

export default QueueItemMenu;
