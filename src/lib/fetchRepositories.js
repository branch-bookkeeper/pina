import {
    map,
    flatten,
    compose,
    prop,
 } from 'ramda';
import allP from './allP';
import fetchUserInstallations from './fetchUserInstallations';
import fetchInstallationRepositories from './fetchInstallationRepositories';

export default accessToken =>
    fetchUserInstallations(accessToken)
        .then(compose(
            allP,
            map(fetchInstallationRepositories(accessToken)),
            map(prop('id'))
        ))
        .then(flatten);
