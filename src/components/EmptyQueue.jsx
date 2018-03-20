import qs from 'qs';
import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { grey } from 'material-ui/colors';

import { bbOrange } from '../constants/colors';
import { repositoryShape, userShape } from '../constants/propTypes';

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    repository: repositoryShape.isRequired,
    user: userShape.isRequired,
    showLinkToAddItems: PropTypes.bool,
};

const styles = theme => ({
    root: {
        border: `dashed 2px ${grey[300]}`,
        padding: theme.spacing.unit * 6,
    },
    message: {
        color: grey[500],
        fontSize: '1.25rem',
        textAlign: 'center',
        '& a': {
            color: bbOrange[500],
        },
    },
});

const getPullRequestsUrlInvolvingUser = (repository, user) => {
    const query = {
        q: `is:open is:pr involves:${user.login} `,
    };

    return `${repository.html_url}/pulls?${qs.stringify(query)}`
};

const EmptyQueue = ({ classes, repository, user, showLinkToAddItems }) => (
    <div className={classes.root}>
        <Typography className={classes.message}>
            There are no PRs in this queue.
            {' '}
            {showLinkToAddItems && <a href={getPullRequestsUrlInvolvingUser(repository, user)}>Add yours</a>}
        </Typography>
    </div>
)

EmptyQueue.propTypes = propTypes;

export default withStyles(styles)(EmptyQueue);
