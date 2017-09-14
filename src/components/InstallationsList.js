import React from 'react';
import PropTypes from 'prop-types';

import { installationShape } from '../constants/propTypes';

import noop from '../helpers/noop';
import withPreloading from '../hocs/withPreloading';

const InstallationsList = ({ userInstallations }) => (
    <ul>
        {userInstallations.map(installation => (
            <li key={installation.id}>
                <h2>{installation.account.login}</h2>
            </li>
        ))}
    </ul>
);

InstallationsList.propTypes = {
    userInstallations: PropTypes.arrayOf(installationShape),
    loadUserInstallations: PropTypes.func,
};

InstallationsList.defaultProps = {
    loadUserInstallations: noop,
};

const isLoadingNeeded = ({ userInstallations }) => !Boolean(userInstallations);
const load = ({ loadUserInstallations }) => loadUserInstallations();

export default withPreloading(isLoadingNeeded, load)(InstallationsList);
