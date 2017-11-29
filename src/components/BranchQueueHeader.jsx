import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { grey } from 'material-ui/colors';
import Grid from 'material-ui/Grid';

import Lock from '../components/icons/Lock';
import PageHeader from '../components/PageHeader';
import PageTitle from '../components/PageTitle';
import BranchChip from '../components/BranchChip';
import UserAvatar from '../components/UserAvatar';

import { repositoryShape } from '../constants/propTypes';

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    repository: repositoryShape.isRequired,
    branch: PropTypes.string.isRequired,
};

const styles = theme => ({
    ownerTitle: {
        color: theme.typography.display1.color,
    },
    repositoryTitle: {
        display: 'inline-block',
        color: theme.typography.headline.color,
        fontWeight: 'bold',
        borderBottom: 'dashed 1px',
        borderBottomColor: grey[400],
        textDecoration: 'none',
        '&:hover': {
            borderBottomStyle: 'solid',
            borderBottomColor: theme.typography.headline.color,
        },
    },
    lockIcon: {
        verticalAlign: 'middle',
        color: theme.typography.display1.color,
        width: 16,
        height: 16,
        marginLeft: theme.spacing.unit,
    },
    branchLink: {
        textDecoration: 'none',
    },
    repositoryLink: {
        transition: theme.transitions.create(['color'], {
            duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
            color: theme.typography.headline.color,
        },
    },
});

const BranchQueueHeader = ({ classes, repository, branch }) => (
    <PageHeader>
        <Grid container style={{ flex: 1 }} spacing={8} alignItems="center">
            <Grid item>
                <UserAvatar username={repository.owner.login} size={48} />
            </Grid>
            <Grid item style={{ flex: 1 }}>
                <PageTitle className={classes.ownerTitle}>
                    {repository.owner.login}
                    {' / '}
                    <a href={repository.html_url} className={classes.repositoryTitle}>
                        {repository.name}
                    </a>
                    {repository.private && <Lock className={classes.lockIcon} />}
                </PageTitle>
            </Grid>
            <Grid item>
                <a href={`${repository.html_url}/tree/${branch}`} className={classes.branchLink}>
                    <BranchChip branch={branch} clickable />
                </a>
            </Grid>
        </Grid>
    </PageHeader>
);

BranchQueueHeader.propTypes = propTypes;

export default withStyles(styles)(BranchQueueHeader);
