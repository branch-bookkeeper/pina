import map from 'ramda/src/map';
import composeP from 'ramda/src/composeP';
import flatten from 'ramda/src/flatten';
import allP from './allP';
import loadUserInstallations from './loadUserInstallations';
import loadInstallationRepositories from './loadInstallationRepositories';

const loadRepositoriesEmbeddingInstallation = accessToken => map(installation =>
    loadInstallationRepositories(accessToken, installation.id)
        .then(map(repo => ({ ...repo, installation })))
);

export default accessToken => composeP(
    flatten,
    allP,
    loadRepositoriesEmbeddingInstallation(accessToken),
    loadUserInstallations
)(accessToken);
