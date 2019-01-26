import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';

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
    <Dialog open={open} TransitionComponent={Slide} onClose={onCancel}>
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
