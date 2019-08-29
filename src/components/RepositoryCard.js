import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { grey } from '@material-ui/core/colors';

import { repositoryShape } from '../constants/propTypes';

import UserAvatar from './UserAvatar';
import Lock from './icons/Lock';
import { textColor, textGreyColor } from '../constants/colors';

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    repository: repositoryShape.isRequired,
};

const styles = theme => ({
    link: {
        textDecoration: 'none',
    },
    root: {
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
        transition: theme.transitions.create(['background-color'], {
            duration: theme.transitions.duration.standard,
        }),
        '&:hover, &:focus': {
            backgroundColor: grey[50],
        }
    },
    ownerTitle: {
        color: textGreyColor,
        fontWeight: 'normal',
    },
    repositoryTitle: {
        color: textColor,
    },
    lockIcon: {
        verticalAlign: 'middle',
        color: textGreyColor,
        width: 12,
        height: 12,
        marginLeft: theme.spacing(1),
    },
});

const RepositoryCard = ({ classes, repository }) => (
    <Link to={`/${repository.full_name}/${repository.default_branch}`} className={classes.link}>
        <Paper className={classes.root} elevation={1}>
            <Grid container style={{ flex: 1 }} spacing={1} alignItems="center">
                <Grid item>
                    <UserAvatar username={repository.owner.login} />
                </Grid>
                <Grid item style={{ flex: 1}}>
                    <Typography variant="h6" className={classes.ownerTitle}>
                        {repository.owner.login}
                        {' / '}
                        <span className={classes.repositoryTitle}>
                            {repository.name}
                        </span>
                        {repository.private && <Lock className={classes.lockIcon} />}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    </Link>
);

RepositoryCard.propTypes = propTypes;

export default withStyles(styles)(RepositoryCard);
