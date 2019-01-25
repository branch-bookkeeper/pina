import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import blue from '@material-ui/core/colors/blue';

import { pushShape } from '../redux';
import { userShape } from '../constants/propTypes';

const propTypes = {
    user: userShape,
    push: pushShape,
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onPushSubscribe: PropTypes.func,
    onPushUnsubscribe: PropTypes.func,
};

const styles = {
    avatar: {
        background: blue[100],
        color: blue[600],
    },
};

class SettingsDialog extends Component {
    render() {
        const { user, push, open, onClose, onPushSubscribe, onPushUnsubscribe } = this.props;

        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Settings</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        <FormControlLabel
                            color="contrast"
                            control={
                                <Switch
                                    checked={(push.isSubscribed && !push.isUnsubscribing) || push.isSubscribing}
                                    disabled={!user || !push.isInitialized || push.isSubscribing || push.isUnsubscribing}
                                    onChange={(event, checked) => checked ? onPushSubscribe() : onPushUnsubscribe()}
                                />
                            }
                            label="Push notifications"
                        />
                    </FormGroup>
                    <DialogContentText>
                        For each booking you will get two notifications: one when your PR is at the top
                        of the queue (you can rebase) and one when all the checks on your PR are green
                        (you can merge).
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

SettingsDialog.propTypes = propTypes;

export default withStyles(styles)(SettingsDialog);
