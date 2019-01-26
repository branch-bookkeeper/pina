import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';

import Lock from '../components/icons/Lock';
import PageHeader from '../components/PageHeader';
import PageTitle from '../components/PageTitle';
import BranchChip from '../components/BranchChip';
import UserAvatar from '../components/UserAvatar';

import { repositoryShape } from '../constants/propTypes';
import { textGreyColor, textColor } from '../constants/colors';

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
            color: textColor,
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
