import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import { bbOrange } from '../constants/colors';
import { userShape } from '../constants/propTypes';
import { requestShape, isNotMade } from '../helpers/request';
import logo from '../assets/favicon-allwhite.svg';

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
        color: bbOrange[100],
    },
    titleLink: {
        color: 'inherit',
        textDecoration: 'none',
        '&:hover, &:active': {
            color: bbOrange[50],
        },
    },
    title: {
        fontSize: '1.1667rem',
        display: 'inline-block'
    },
    logo: {
        width: 32,
        height: 32,
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
                                <Grid item>
                                    <Link to="/">
                                        <img src={logo} alt="logo" className={classes.logo} />
                                    </Link>
                                </Grid>
                                <Grid item style={{ flex: 1 }}>
                                    <Link to="/" className={classes.titleLink}>
                                        <Typography type="title" color="inherit" className={classes.title}>
                                            Branch Bookkeeper
                                        </Typography>
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
