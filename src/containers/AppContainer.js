import { compose } from 'ramda';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import App from '../pages/App';
import {
    loadUser,
    loadRepository,
    loadRepositories,
    loadRepositoryPullRequests,
    loadBranchQueue,
    addToBranchQueue,
    deleteFromBranchQueue,
} from '../redux/requests';
import {
    startQueueUpdates,
    stopQueueUpdates,
} from '../redux/queueUpdate';

const mapStateToProps = ({
    user,
    entities,
    requests,
}) => ({
    user,
    entities,
    requests,
});

const mapDispatchToProps = {
    loadUser,
    loadRepository,
    loadRepositories,
    loadRepositoryPullRequests,
    loadBranchQueue,
    addToBranchQueue,
    deleteFromBranchQueue,
    startQueueUpdates,
    stopQueueUpdates,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(App);
