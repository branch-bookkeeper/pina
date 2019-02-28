import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import LogoMonochrome from './icons/LogoMonochrome';
import Logo from './icons/Logo';

const styles = theme => ({
    root: {
        padding: '44px 20px 44px 20px',
    },
    divider: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    container: {
        paddingTop: 24,
        color: grey[500],
    },
    link: {
        color: grey[500],
        position: 'relative',
    },
    logo: {
        width: 48,
        height: 48,
        transition: theme.transitions.create(['color'], {
            duration: theme.transitions.duration.standard,
        }),
    },
    logoColor: {
        position: 'absolute',
        opacity: 0,
        transition: theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.standard,
        }),
        '&:hover': {
            opacity: 1,
        },
    },
});

const PageFooter = ({ classes, children }) => (
    <footer className={classes.root}>
        <Grid container justify="center">
            <Grid item xs={12} sm={9} md={8} lg={6} xl={4}>
                <Divider className={classes.divider} />
                <Grid container className={classes.container} alignItems="center">
                    <Grid item style={{ flex: 1}} />
                    <Grid item>
                        <Link to="/" className={classes.link}>
                            <Logo className={classNames(classes.logo, classes.logoColor)} />
                            <LogoMonochrome className={classes.logo} />
                        </Link>
                    </Grid>
                    <Grid item style={{ flex: 1 }} />
                </Grid>
            </Grid>
        </Grid>
    </footer>
);

export default withStyles(styles)(PageFooter);
