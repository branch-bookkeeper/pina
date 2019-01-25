import isNil from 'ramda/src/isNil';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

import { bbOrange } from '../constants/colors';
import { userShape } from '../constants/propTypes';

import UserMenu from './UserMenu';
import UserAvatar from './UserAvatar';

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    user: userShape,
    onOpenSettings: PropTypes.func,
    onLogout: PropTypes.func,
};

const styles = theme => ({
    link: {
        display: 'block',
        listStyle: 'none',
        cursor: 'pointer',
        color: bbOrange[100],
        transition: theme.transitions.create(['color'], {
            duration: theme.transitions.duration.standard,
        }),
        '& summary::-webkit-details-marker': {
            display: 'none',
        },
        '&:hover': {
            color: 'white',
        },
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
            <div>
                <details
                    className={classes.link}
                    open={!isNil(menuAnchorEl)}
                    onClick={this.handleAvatarClick}
                >
                    <summary>
                        <span className={classes.avatarWrapper}>
                            <UserAvatar username={user.login} size={32} />
                        </span>
                        <ArrowDropDown className={classes.avatarArrow} />
                    </summary>
                    <UserMenu
                        anchorEl={menuAnchorEl}
                        open={!isNil(menuAnchorEl)}
                        onClose={this.handleCloseRequest}
                        onOpenSettings={onOpenSettings}
                        onLogout={onLogout}
                    />
                </details>
            </div>
        );
    }

    handleAvatarClick = (ev) => {
        ev.preventDefault();

        if (this.state.menuAnchorEl === null) {
            this.setState({
                menuAnchorEl: ev.currentTarget,
            });
        }
    };

    handleCloseRequest = () => {
        this.setState({ menuAnchorEl: null });
    };
};

TopBarUserAvatar.propTypes = propTypes;

export default withStyles(styles)(TopBarUserAvatar);
