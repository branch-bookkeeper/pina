import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Dialog, { DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui/Dialog';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import FormGroup from 'material-ui/Form/FormGroup';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';
import blue from 'material-ui/colors/blue';

import { pushShape } from '../redux';
import { userShape } from '../constants/propTypes';

const propTypes = {
    user: userShape,
    push: pushShape,
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    onRequestClose: PropTypes.func,
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
        const { user, push, open, onRequestClose, onPushSubscribe, onPushUnsubscribe } = this.props;

        return (
            <Dialog open={open} onRequestClose={onRequestClose}>
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
                    <Button onClick={onRequestClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

SettingsDialog.propTypes = propTypes;

export default withStyles(styles)(SettingsDialog);
