import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { grey } from 'material-ui/colors';
import Grid from 'material-ui/Grid';

import MarkGitHub from '../components/icons/MarkGitHub';
import PageHeader from '../components/PageHeader';
import PageTitle from '../components/PageTitle';
import BranchChip from '../components/BranchChip';

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
        fontWeight: 'bold',
        borderBottom: 'dashed 1px',
        borderBottomColor: grey[400],
        '&:hover': {
            borderBottomStyle: 'solid',
            borderBottomColor: theme.typography.headline.color,
        },
    },
    repositoryServiceIcon: {
        width: '24px',
        height: '24px',
        color: theme.typography.display1.color,
        // Fix vertical alignment.
        paddingTop: '6px',
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
                <MarkGitHub className={classes.repositoryServiceIcon} />
            </Grid>
            <Grid item>
                <PageTitle className={classes.ownerTitle}>
                    {repository.owner.login}
                </PageTitle>
            </Grid>
            <Grid item>
                <PageTitle className={classes.ownerTitle}>
                    /
                </PageTitle>
            </Grid>
            <Grid item style={{ flex: 1}}>
                <a href={repository.html_url}>
                    <PageTitle className={classes.repositoryTitle}>
                        {repository.name}
                    </PageTitle>
                </a>
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
