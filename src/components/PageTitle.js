import React from 'react';
import Typography from '@material-ui/core/Typography';

const PageTitle = ({ children, ...props }) => (
    <Typography variant="h5" component="h1" style={{ fontSize: '1.75rem' }} {...props}>
        {children}
    </Typography>
);

export default PageTitle;
