import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import { queueItemShape, userShape } from '../constants/propTypes';

const propTypes = {
    open: PropTypes.bool,
    queueItemToRemove: queueItemShape.isRequired,
    currentUser: userShape.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

const QueueCancelConfirmDialog = ({
    open,
    queueItemToRemove,
    currentUser,
    onCancel,
    onConfirm,
}) => (
    <Dialog open={open} transition={Slide} onRequestClose={onCancel}>
        {currentUser.login === queueItemToRemove.username
            ? <DialogTitle>Remove yourself from the queue?</DialogTitle>
            : <DialogTitle>Remove {queueItemToRemove.username} from the queue?</DialogTitle>}
        <DialogActions>
            <Button onClick={onCancel} color="primary">
                No
            </Button>
            <Button onClick={onConfirm} color="primary">
                Yes
            </Button>
        </DialogActions>
    </Dialog>
);

QueueCancelConfirmDialog.propTypes = propTypes;

export default QueueCancelConfirmDialog;
