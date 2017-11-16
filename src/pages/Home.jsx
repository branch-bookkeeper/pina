import React from 'react';
import PropTypes from 'prop-types';

import { repositoryShape } from '../constants/propTypes';

import PageHeader from '../components/PageHeader';
import PageTitle from '../components/PageTitle';
import PageContent from '../components/PageContent';
import RepositoriesList from '../components/RepositoriesList';

const propTypes = {
    repositories: PropTypes.arrayOf(repositoryShape),
};

const Home = ({ repositories }) => (
    <div>
        <PageHeader>
            <PageTitle>
                Your Repositories
            </PageTitle>
        </PageHeader>
        <PageContent>
            <RepositoriesList
                repositories={repositories}
            />
        </PageContent>
    </div>
);

Home.propTypes = propTypes;

export default Home;