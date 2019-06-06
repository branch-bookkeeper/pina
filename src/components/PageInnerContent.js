import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

const defaultProps = {
    className: null,
    children: null,
}

const PageInnerContent = ({ className, children }) => (
    <Grid container justify="center" className={className}>
        <Grid item xs={12} sm={9} md={8} lg={6} xl={4}>
            {children}
        </Grid>
    </Grid>
);

PageInnerContent.propTypes = propTypes;
PageInnerContent.defaultProps = defaultProps;

export default PageInnerContent;
