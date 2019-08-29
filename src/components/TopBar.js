import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';

import { bbOrange } from '../constants/colors';
import { userShape } from '../constants/propTypes';
import { requestShape, isNotMade } from '../lib/request';

import LogoTextMonochrome from './icons/LogoTextMonochrome';
import TopBarUserAvatar from './TopBarUserAvatar';

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    onOpenSettings: PropTypes.func,
    onLogout: PropTypes.func,
    user: userShape,
    userRequest: requestShape,
    loadUser: PropTypes.func,
};

const styles = theme => ({
    root: {
        color: bbOrange[50],
    },
    titleLink: {
        color: 'inherit',
        textDecoration: 'none',
        transition: theme.transitions.create(['color'], {
            duration: theme.transitions.duration.standard,
        }),
        '&:hover, &:active': {
            color: 'white',
        },
    },
    title: {
        width: 130,
        height: 32,
    },
    logo: {
        width: 32,
        height: 32,
        color: 'white',
    },
    avatarWrapper: {
        display: 'inline-block',
        verticalAlign: 'middle',
    },
    avatarArrow: {
        verticalAlign: 'middle',
    },
});

class TopBar extends Component {
    render() {
        const {
            classes,
            user,
            onOpenSettings,
            onLogout,
        } = this.props;

        return (
            <AppBar position="fixed" className={classes.root} color="primary" elevation={1}>
                <Toolbar>
                    <Grid container justify="center">
                        <Grid item xs={12} sm={10} md={9} lg={7} xl={5}>
                            <Grid container alignItems="center">
                                <Grid item style={{ flex: 1 }}>
                                    <Link to="/" className={classes.titleLink}>
                                        <LogoTextMonochrome className={classes.title} />
                                    </Link>
                                </Grid>
                                {user &&
                                    <Grid item>
                                        <TopBarUserAvatar
                                            user={user}
                                            onOpenSettings={onOpenSettings}
                                            onLogout={onLogout}
                                        />
                                    </Grid>}
                            </Grid>
                        </Grid>
                    </Grid>
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

export default withStyles(styles)(TopBar);
