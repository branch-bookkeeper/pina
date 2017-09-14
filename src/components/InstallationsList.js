import partial from 'ramda/src/partial';
import React from 'react';
import PropTypes from 'prop-types';

import { installationShape, repositoryShape } from '../constants/propTypes';

import noop from '../helpers/noop';
import withPreloading from '../hocs/withPreloading';

import RepositoriesList from './RepositoriesList';

const InstallationsList = ({
    userInstallations,
    repositoriesByInstallation,
    loadInstallationRepositories
}) => (
    <ul>
        {userInstallations.map(installation => (
            <li key={installation.id}>
                <h2>{installation.account.login}</h2>
                <RepositoriesList
                    repositories={repositoriesByInstallation[installation.id]}
                    loadRepositories={partial(loadInstallationRepositories, [installation.id])}
                />
            </li>
        ))}
    </ul>
);

InstallationsList.propTypes = {
    userInstallations: PropTypes.arrayOf(installationShape),
    repositoriesByInstallation: PropTypes.objectOf(PropTypes.arrayOf(repositoryShape)),
    loadUserInstallations: PropTypes.func,
    loadInstallationRepositories: PropTypes.func,
};

InstallationsList.defaultProps = {
    loadUserInstallations: noop,
    loadInstallationRepositories: noop,
};

const isLoadingNeeded = ({ userInstallations }) => !Boolean(userInstallations);
const load = ({ loadUserInstallations }) => loadUserInstallations();

export default withPreloading(isLoadingNeeded, load)(InstallationsList);
