import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { repositoryShape } from '../constants/propTypes';

import BranchName from './BranchName';

const propTypes = {
    repositories: PropTypes.arrayOf(repositoryShape),
};

const RepositoriesList = ({ repositories }) => (
    <ul>
        {repositories.map(repository => (
            <li key={repository.full_name}>
                <h3>
                    <Link to={`${repository.full_name}/${repository.default_branch}`}>
                        {repository.full_name} <BranchName branch={repository.default_branch} />
                    </Link>
                </h3>
            </li>
        ))}
    </ul>
);

RepositoriesList.propTypes = propTypes;

export default RepositoriesList;
