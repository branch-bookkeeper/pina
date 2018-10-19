import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';

import { GITHUB_CLIENT_ID } from '../constants/config';

import MarkGithub from '../components/icons/MarkGitHub';
import Logo from '../components/icons/Logo';
import LogoText from '../components/icons/LogoText';

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    errorMessage: PropTypes.string,
    loading: PropTypes.bool,
    onLogin: PropTypes.func,
};

const defaultProps = {
    onLogin: () => {},
};

const styles = theme => ({
    root: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            backgroundColor: 'white',
            alignItems: 'start',
        },
    },
    paper: {
        position: 'relative',
        padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 4}px`,
        [theme.breakpoints.down('sm')]: {
            padding: `${theme.spacing.unit*4} 0 0 0`,
            boxShadow: 'none',
        },
    },
    logo: {
        width: 150,
        height: 150,
        [theme.breakpoints.down('sm')]: {
            width: 100,
            height: 100,
        },
    },
    logoText: {
        width: '250px',
        height: '100px',
        paddingRight: 32,
        paddingBottom: 28,
        marginLeft: -16,
        [theme.breakpoints.down('sm')]: {
            width: 150,
            height: 100,
            paddingRight: 16,
            paddingBottom: 20,
        },
    },
    error: {
        marginTop: theme.spacing.unit * 3,
        textAlign: 'center',
    },
    button: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing.unit * 2,
        },
    },
    githubIcon: {
        marginRight: theme.spacing.unit,
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

const LoginScreen = ({ classes, errorMessage, loading, onLogin }) => (
    <div className={classes.root}>
        <Paper className={classes.paper} elevation={6}>
            {loading && <CircularProgress className={classes.progress} />}
            <div className={classNames({
                [classes.disabled]: loading,
            })}>
                <Grid container alignItems="center" justify="center" spacing={0}>
                    <Grid item>
                        <Logo className={classes.logo} />
                    </Grid>
                    <Grid item>
                        <LogoText className={ classes.logoText } />
                    </Grid>
                </Grid>
                <Divider />
                {errorMessage &&
                    <Typography className={classes.error} type="body1" component="p" color="error">
                        {errorMessage}<br />
                        Click the login button to try again.
                    </Typography>}
                <Button
                    className={classes.button}
                    component="a"
                    href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`}
                    onClick={onLogin}
                >
                    <MarkGithub className={classes.githubIcon} />
                    Login with GitHub
                </Button>
            </div>
        </Paper>
    </div>
);

LoginScreen.propTypes = propTypes;
LoginScreen.defaultProps = defaultProps;

export default withStyles(styles)(LoginScreen);
