import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { grey } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { replace } from 'ramda';

import Lock from '../components/icons/Lock';
import PageHeader from '../components/PageHeader';
import PageTitle from '../components/PageTitle';
import BranchChip from '../components/BranchChip';
import UserAvatar from '../components/UserAvatar';

import { repositoryShape } from '../constants/propTypes';
import { textGreyColor, textColor } from '../constants/colors';
import PageBanner from './PageBanner';
import GitBranch from './icons/GitBranch';

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    repository: repositoryShape.isRequired,
    branch: PropTypes.string.isRequired,
};

const styles = theme => ({
    ownerTitle: {
        color: textGreyColor,
    },
    repositoryTitle: {
        display: 'inline-block',
        color: textColor,
        fontWeight: 'bold',
        borderBottom: 'dashed 1px',
        borderBottomColor: grey[400],
        textDecoration: 'none',
        '&:hover': {
            borderBottomStyle: 'solid',
            borderBottomColor: textColor,
        },
    },
    lockIcon: {
        verticalAlign: 'middle',
        color: textGreyColor,
        width: 16,
        height: 16,
        marginLeft: theme.spacing(1),
    },
    branchLink: {
        textDecoration: 'none',
    },
    repositoryLink: {
        transition: theme.transitions.create(['color'], {
            duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
            color: textColor,
        },
    },
});

const BranchQueueHeader = ({ classes, repository, branch }) => (
    <PageHeader
        bottomContent={branch !== repository.default_branch ? (
            <PageBanner
                icon={<GitBranch />}
                callToAction={`Go to ${repository.default_branch}'s queue`}
                callToActionHref={replace(`/${branch}`, `/${repository.default_branch}`, window.location.href)}
                dismissable
            >
                <Typography>
                    You are seeing the queue for branch
                    {' '}
                    <strong>{branch}</strong>,
                    which is not the default one for this repository
                </Typography>
            </PageBanner>
        ) : null}
    >
        <Grid container style={{ flex: 1 }} spacing={1} alignItems="center">
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
