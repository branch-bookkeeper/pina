import { defaultTo } from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import GitBranch from '../components/icons/GitBranch';

const noop = () => {};

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    branch: PropTypes.string.isRequired,
    clickable: PropTypes.bool,
    onClick: PropTypes.func,
};

const styles = theme => ({
    root: {
        fontSize: '1.1rem',
    },
    avatar: {
        backgroundColor: 'transparent',
        color: 'inherit',
        marginLeft: theme.spacing(0.5),
        marginRight: -theme.spacing(2),
    },
});

const BranchChip = ({ classes, branch, clickable, onClick }) => (
    <Chip
        className={classes.root}
        avatar={<Avatar className={classes.avatar}><GitBranch /></Avatar>}
        label={branch}
        onClick={clickable ? defaultTo(noop, onClick) : null}
    />
);

BranchChip.propTypes = propTypes;

export default withStyles(styles)(BranchChip);
