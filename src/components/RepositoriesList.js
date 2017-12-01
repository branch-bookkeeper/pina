import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import { repositoryShape } from '../constants/propTypes';

import RepositoryCard from './RepositoryCard';

const propTypes = {
    repositories: PropTypes.arrayOf(repositoryShape),
};

const RepositoriesList = ({ repositories }) => (
    <Grid container direction="column" spacing={8}>
        {repositories.map(repository => (
            <Grid item key={repository.full_name}>
                <RepositoryCard repository={repository} />
            </Grid>
        ))}
    </Grid>
);

RepositoriesList.propTypes = propTypes;

export default RepositoriesList;
