import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PageInnerContent from './PageInnerContent';

const styles = theme => ({
    root: {
        padding: '84px 20px 20px 20px',
        marginBottom: 24,
        backgroundColor: 'white',
    },
});

const PageHeader = ({ classes, children }) => (
    <header className={classes.root}>
        <PageInnerContent>
            {children}
        </PageInnerContent>
    </header>
);

export default withStyles(styles)(PageHeader);
