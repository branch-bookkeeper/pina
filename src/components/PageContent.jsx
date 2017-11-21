import React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {
        padding: '0 20px',
    },
});

const PageContent = ({ classes, children }) => (
    <div className={classes.root}>
        <Grid container justify="center">
            <Grid item xs={12} sm={9} md={8} lg={6} xl={4}>
                {children}
            </Grid>
        </Grid>
    </div>
);

export default withStyles(styles)(PageContent);
