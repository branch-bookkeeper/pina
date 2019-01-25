import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        padding: '84px 20px 20px 20px',
        marginBottom: 24,
        backgroundColor: 'white',
    },
});

const PageHeader = ({ classes, children }) => (
    <header className={classes.root}>
        <Grid container justify="center">
            <Grid item xs={12} sm={9} md={8} lg={6} xl={4}>
                {children}
            </Grid>
        </Grid>
    </header>
);

export default withStyles(styles)(PageHeader);
