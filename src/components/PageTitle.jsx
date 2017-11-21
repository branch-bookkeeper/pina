import React from 'react';
import Typography from 'material-ui/Typography';

const PageTitle = ({ children, ...props }) => (
    <Typography type="headline" component="h1" style={{ fontSize: '1.75rem' }} {...props}>
        {children}
    </Typography>
);

export default PageTitle;
