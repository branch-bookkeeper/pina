import isNil from 'ramda/src/isNil';
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { queueItemShape, pullRequestShape } from '../constants/propTypes';

import MarkGitHub from './icons/MarkGitHub';
import ArrowTooltip from './ArrowTooltip';
import UserAvatar from './UserAvatar';
import { textGreyColor } from '../constants/colors';

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    elevation: PropTypes.number,
    index: PropTypes.number,
    queueItem: queueItemShape.isRequired,
    pullRequest: pullRequestShape,
    showPullRequestLink: PropTypes.bool,
    loading: PropTypes.bool,
    renderMenu: PropTypes.func,
    onClick: PropTypes.func,
    children: PropTypes.node,
};

const defaultProps = {
    elevation: 1,
    showPullRequestLink: true,
    renderMenu: () => {},
    onClick: () => {},
};

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        position: 'relative',
    }),
    titleGridItem: {
        flex: 1,
        minWidth: 0,
        position: 'relative',
    },
    positionInQueue: {
        lineHeight: '60px',
        color: textGreyColor,
    },
    pullRequestTitle: {
        wordBreak: 'break-word',
    },
    hidden: {
        visibility: 'hidden',
    },
    outerGridContainer: {
        transition: theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.standard,
        }),
    },
    disabled: {
        pointerEvents: 'none',
        opacity: 0.2,
    },
    progress: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -20,
        marginTop: -20,
    },
});

class QueueItemCard extends Component {
    state = {
        menuAnchorEl: null,
    };

    render() {
        const {
            classes,
            elevation,
            index,
            queueItem: { username },
            pullRequest = {},
            showPullRequestLink,
            loading,
            children,
            renderMenu,
        } = this.props;
        const {
            menuAnchorEl,
        } = this.state;

        const menu = renderMenu({
            open: Boolean(menuAnchorEl),
            anchorEl: menuAnchorEl,
            onClose: this.handleRequestClose,
        });

        return (
            <Paper
                className={classes.root}
                elevation={elevation}
                onClick={this.handleClick}
                onMouseUp={this.handleMouseUp}
                onMouseDown={this.handleMouseDown}
                onMouseLeave={this.handleMouseLeave}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
            >
                {loading && <CircularProgress className={classes.progress} />}
                <Grid
                    container
                    direction="row"
                    alignItems="flex-start"
                    wrap="nowrap"
                    spacing={16}
                    className={classNames('outerGridContainer', {
                        [classes.disabled]: loading,
                    })}
                >
                    {!isNil(index) &&
                        <Grid item>
                            <Typography variant="h3" className={classes.positionInQueue}>
                                {index + 1}
                            </Typography>
                        </Grid>}
                    <Grid item>
                        <ArrowTooltip title={username} enterDelay={500}>
                            <UserAvatar username={username} size={60} />
                        </ArrowTooltip>
                    </Grid>
                    <Grid item className={classes.titleGridItem}>
                        <Typography variant="h5" component="h3" className={classes.pullRequestTitle}>
                            {pullRequest.title}
                        </Typography>
                        <Grid container alignItems="center">
                            <Grid item style={{ flexGrow: 1 }}>
                                <Typography variant="body2" component="p">
                                    #{pullRequest.pullRequestNumber}
                                </Typography>
                            </Grid>
                            {showPullRequestLink &&
                                <Grid item>
                                    <Button component="a" href={pullRequest.humanUrl} size="small">
                                        <MarkGitHub style={{ marginRight: 8, width: 20, height: 20 }} />
                                        Open in GitHub
                                    </Button>
                                </Grid>}
                        </Grid>
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={this.handleMoreClick}
                            className={classNames({
                                [classes.hidden]: !Boolean(menu),
                            })}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        {menu}
                    </Grid>
                </Grid>
                {children}
            </Paper>
        );
    }

    handleMoreClick = event => {
        event.stopPropagation();
        this.setState({ menuAnchorEl: event.currentTarget });
    };

    handleRequestClose = () => {
        this.setState({ menuAnchorEl: null });
    };
};

QueueItemCard.propTypes = propTypes;
QueueItemCard.defaultProps = defaultProps;

export default withStyles(styles)(QueueItemCard);
