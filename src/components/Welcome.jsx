import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import Awesome from './icons/Awesome';
import PageContent from './PageContent';

const styles = theme => ({
    root: {
        marginTop: 104,
        [theme.breakpoints.down('sm')]: {
            marginTop: 84,
        },
    },
    paper: {
        padding: theme.spacing.unit * 4,
    },
    container: {
        [theme.breakpoints.down('sm')]: {
            alignItems: 'center',
            flexDirection: 'column',
        },
    },
    illustration: {
        width: 128,
        height: 128,
    },
    buttonContainer: {
        marginTop: theme.spacing.unit * 2,
        textAlign: 'center',
    },
});

const Welcome = ({ classes }) => (
    <div className={classes.root}>
        <PageContent>
            <Paper className={classes.paper}>
                <Grid container spacing={24} className={classes.container}>
                    <Grid item>
                        <Awesome className={classes.illustration} />
                    </Grid>
                    <Grid item style={{ flex: 1 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            You are one step away from merge heaven
                        </Typography>
                        <Typography variant="body2" component="p" gutterBottom>
                            Install Branch Bookkeeper in your personal repositories or organization
                            and <strong>never stare at a pull request page again</strong>.
                        </Typography>
                    </Grid>
                </Grid>
                <div className={classes.buttonContainer}>
                    <Button color="primary" variant="contained" component="a" href="https://get.branch-bookkeeper.com">
                        Install Branch Bookkeeper
                    </Button>
                </div>
            </Paper>
        </PageContent>
    </div>
);

export default withStyles(styles)(Welcome);