import isNil from 'ramda/src/isNil';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';
import ArrowDropDown from 'material-ui-icons/ArrowDropDown';

import { bbOrange } from '../constants/colors';
import { userShape } from '../constants/propTypes';

import UserMenu from './UserMenu';

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    user: userShape,
    onOpenSettings: PropTypes.func,
    onLogout: PropTypes.func,
};

const styles = theme => ({
    root: {
        '& a, & a:visited': {
            color: bbOrange[100],
        },
        '& a:hover, & a:active': {
            color: 'white',
        },
    },
    link: {
        display: 'block',
        listStyle: 'none',
        cursor: 'pointer',
        '& summary::-webkit-details-marker': {
            display: 'none',
        },
    },
    avatar: {
        width: 32,
        height: 32,
    },
    avatarWrapper: {
        display: 'inline-block',
        verticalAlign: 'middle',
    },
    avatarArrow: {
        verticalAlign: 'middle',
        width: 20,
        height: 20,
    },
});

class TopBarUserAvatar extends Component {
    state = {
        menuAnchorEl: null,
    };

    render() {
        const {
            classes,
            user,
            onOpenSettings,
            onLogout,
        } = this.props;
        const { menuAnchorEl } = this.state;

        return (
            <div className={classes.root}>
                <details
                    className={classes.link}
                    open={!isNil(menuAnchorEl)}
                    onClick={this.handleAvatarClick}
                >
                    <summary>
                        <span className={classes.avatarWrapper}>
                            <Avatar
                                className={classes.avatar}
                                alt={user.login}
                                src={user.avatar_url}
                            />
                        </span>
                        <ArrowDropDown className={classes.avatarArrow} />
                    </summary>
                    <UserMenu
                        anchorEl={menuAnchorEl}
                        open={!isNil(menuAnchorEl)}
                        onRequestClose={this.handleCloseRequest}
                        onOpenSettings={onOpenSettings}
                        onLogout={onLogout}
                    />
                </details>
            </div>
        );
    }

    handleAvatarClick = (ev) => {
        ev.preventDefault();

        this.setState({
            menuAnchorEl: ev.currentTarget,
        });
    };

    handleCloseRequest = () => {
        this.setState({ menuAnchorEl: null });
    };
};

TopBarUserAvatar.propTypes = propTypes;

export default withStyles(styles)(TopBarUserAvatar);
