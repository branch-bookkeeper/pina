import React from 'react';
import PropTypes from 'prop-types';

import { repositoryShape } from '../constants/propTypes';

import RepositoriesList from '../components/RepositoriesList';

const Home = ({ repositories, loadRepositories }) => (
    <div>
        <h1>Branch Bookkeeper</h1>
        <RepositoriesList
            repositories={repositories}
            loadRepositories={loadRepositories}
        />
    </div>
);

Home.propTypes = {
    repositories: PropTypes.arrayOf(repositoryShape),
    loadRepositories: PropTypes.func,
};

export default Home;
