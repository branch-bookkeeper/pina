import map from 'ramda/src/map';
import composeP from 'ramda/src/composeP';
import flatten from 'ramda/src/flatten';
import allP from './allP';
import fetchUserInstallations from './fetchUserInstallations';
import fetchInstallationRepositories from './fetchInstallationRepositories';

const loadRepositoriesEmbeddingInstallation = accessToken => map(installation =>
    fetchInstallationRepositories(accessToken, installation.id)
        .then(map(repo => ({ ...repo, installation })))
);

export default accessToken => composeP(
    flatten,
    allP,
    loadRepositoriesEmbeddingInstallation(accessToken),
    fetchUserInstallations
)(accessToken);
