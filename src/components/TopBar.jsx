import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import { pushShape } from '../redux';
import { userShape } from '../constants/propTypes';
import { requestShape, isNotMade } from '../helpers/request';

const propTypes = {
    onPushSubscribe: PropTypes.func,
    onPushUnsubscribe: PropTypes.func,
    push: pushShape.isRequired,
    user: userShape,
    userRequest: requestShape,
    loadUser: PropTypes.func,
};

class TopBar extends Component {
    render() {
        const {
            user,
            push,
            onPushSubscribe,
            onPushUnsubscribe,
        } = this.props;

        return (
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography type="title" color="inherit" style={{ flex: 1 }}>
                        Branch Bookkeeper
                    </Typography>
                    <FormGroup>
                        <FormControlLabel
                            color="contrast"
                            control={
                                <Switch
                                    color="contrast"
                                    checked={(push.isSubscribed && !push.isUnsubscribing) || push.isSubscribing}
                                    disabled={!user || !push.isInitialized || push.isSubscribing || push.isUnsubscribing}
                                    onChange={(event, checked) => checked ? onPushSubscribe() : onPushUnsubscribe()}
                                />
                            }
                            label="Send me push notifications"
                        />
                    </FormGroup>
                </Toolbar>
            </AppBar>
        );
    }

    componentDidMount() {
        const { userRequest, loadUser } = this.props;

        isNotMade(userRequest) && loadUser();
    }
};

TopBar.propTypes = propTypes;

export default TopBar;
