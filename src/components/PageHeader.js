import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import PageInnerContent from './PageInnerContent';

const styles = theme => ({
    root: {
        padding: '84px 20px 20px 20px',
        marginBottom: 24,
        backgroundColor: 'white',
    },
    topContentWrapper: {
        margin: '-20px -20px 20px -20px',
    },
    bottomContentWrapper: {
        margin: '20px -20px -20px -20px',
    },
});

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    children: PropTypes.node,
    topContent: PropTypes.node,
    bottomContent: PropTypes.node,
};

const defaultProps = {
    children: null,
    topContent: null,
    bottomContent: null,
};

const PageHeader = ({
    classes,
    children,
    topContent,
    bottomContent,
}) => (
    <header className={classes.root}>
        {topContent && (
            <div className={classes.topContentWrapper}>
                {topContent}
            </div>
        )}
        <PageInnerContent>
            {children}
        </PageInnerContent>
        {bottomContent && (
            <div className={classes.bottomContentWrapper}>
                {bottomContent}
            </div>
        )}
    </header>
);

PageHeader.propTypes = propTypes;
PageHeader.defaultProps = defaultProps;

export default withStyles(styles)(PageHeader);
