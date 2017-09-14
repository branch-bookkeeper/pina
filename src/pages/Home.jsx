import React from 'react';
import PropTypes from 'prop-types';

import { installationShape } from '../constants/propTypes';

import InstallationsList from '../components/InstallationsList';

const Home = (props) => (
    <div>
        <h1>Branch Bookkeeper</h1>
        <InstallationsList
            {...props}
        />
    </div>
);

Home.propTypes = {
    userInstallations: PropTypes.arrayOf(installationShape),
    loadUserInstallations: PropTypes.func,
};

export default Home;
