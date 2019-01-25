import React from 'react';

import Typography from '@material-ui/core/Typography';
import PageHeader from '../components/PageHeader';
import PageTitle from '../components/PageTitle';
import PageContent from '../components/PageContent';

export default () => (
    <div>
        <PageHeader>
            <PageTitle>404</PageTitle>
        </PageHeader>
        <PageContent>
            <Typography variant="body2" gutterBottom>
                The page you were looking for could not be found
            </Typography>
        </PageContent>
    </div>
);
