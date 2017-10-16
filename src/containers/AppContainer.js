import compose from 'ramda/src/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import App from '../pages/App';
import {
    loadUser,
    loadRepositories,
    loadPullRequest,
    loadBranchQueue,
    addToBranchQueue,
    deleteFromBranchQueue,
} from '../redux/requests';

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
    loadRepositories,
    loadPullRequest,
    loadBranchQueue,
    addToBranchQueue,
    deleteFromBranchQueue,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(App);
