import React from 'react';
import PropTypes from 'prop-types';

import { repositoryShape } from '../constants/propTypes';

import RepositoriesList from '../components/RepositoriesList';

const propTypes = {
    repositories: PropTypes.arrayOf(repositoryShape),
};

const Home = ({ repositories }) => (
    <RepositoriesList
        repositories={repositories}
    />
);

Home.propTypes = propTypes;

export default Home;