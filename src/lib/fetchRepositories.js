import map from 'ramda/src/map';
import flatten from 'ramda/src/flatten';
import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';
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
