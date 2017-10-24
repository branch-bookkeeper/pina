import any from 'ramda/src/any';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import apply from 'ramda/src/apply';
import filter from 'ramda/src/filter';
import toPairs from 'ramda/src/toPairs';
import prop from 'ramda/src/prop';
import keys from 'ramda/src/keys';
import values from 'ramda/src/values';
import length from 'ramda/src/length';
import equals from 'ramda/src/equals';
import partial from 'ramda/src/partial';
import { connect } from 'react-redux';

import { isMade } from '../helpers/request';
import { filterRequestsByDomain } from '../helpers/requestId';
import { loadInstallations, loadInstallationRepositories } from '../redux/requests';

import renderNothingIf from '../hocs/renderNothingIf';
import withPreloading from '../hocs/withPreloading';
import Home from '../pages/Home';

const isInstallationsLoadingNeeded = ({ installationsRequest }) => !isMade(installationsRequest);
const doLoadInstallations = ({ loadInstallations }) => loadInstallations();

const isRepositoriesLoadingNeeded = ({ installations, installationRepositoriesRequests }) =>
    compose(
        any(owner => !isMade(installationRepositoriesRequests[owner])),
        keys,
    )(installations);

const doLoadRepositories = ({
    accessToken,
    installations,
    installationRepositoriesRequests,
    loadInstallationRepositories
}) => compose(
    map(apply(partial(loadInstallationRepositories, [accessToken]))),
    filter(([owner, id]) => !isMade(installationRepositoriesRequests[owner])),
    toPairs,
    map(prop('id')),
)(installations);

const mapStateToProps = ({
    requests: { installations: installationsRequest, ...requests },
    entities: { installations, repositories },
}) => ({
    installationsRequest,
    installationRepositoriesRequests: filterRequestsByDomain('repositories')(requests),
    installations,
    repositories: values(repositories),
});

const mapDispatchToProps = {
    loadInstallations,
    loadInstallationRepositories,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withPreloading(isInstallationsLoadingNeeded, doLoadInstallations),
    renderNothingIf(compose(equals(0), length, keys, prop('installations'))),
    withPreloading(isRepositoriesLoadingNeeded, doLoadRepositories),
)(Home);
