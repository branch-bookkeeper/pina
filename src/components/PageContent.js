import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PageInnerContent from './PageInnerContent';

const styles = theme => ({
    root: {
        padding: '0 20px',
    },
});

const PageContent = ({ classes, children }) => (
    <div className={classes.root}>
        <PageInnerContent>
            {children}
        </PageInnerContent>
    </div>
);

export default withStyles(styles)(PageContent);
