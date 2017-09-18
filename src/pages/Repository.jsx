import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';
import { branch, renderComponent } from 'recompose';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import noop from '../helpers/noop';
import { requestShape, createWithError, isMade, isErrored } from '../helpers/request';
import findPullRequestQueueItem from '../helpers/findPullRequestQueueItem';
import { userShape, repositoryShape, queueShape, pullRequestShape } from '../constants/propTypes';
import withPreloading from '../hocs/withPreloading';

import PullRequestPage from './PullRequestPage';
import BranchQueue from './BranchQueue';
import NotFound from './NotFound';

const propTypes = {
    baseUrl: PropTypes.string.isRequired,
    user: userShape,
    repository: repositoryShape,
    repositoryRequest: requestShape.isRequired,
    branchQueues: PropTypes.objectOf(queueShape).isRequired,
    pullRequests: PropTypes.objectOf(pullRequestShape).isRequired,
    pullRequestsRequest: requestShape,
    loadUser: PropTypes.func,
    loadRepository: PropTypes.func,
    loadBranchQueue: PropTypes.func,
    loadPullRequests: PropTypes.func,
    onAddToBranchQueue: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
};

const defaultProps = {
    loadRepository: noop,
};

class Repository extends Component {
    constructor(props) {
        super(props);

        this._renderBranchQueuePage = this._renderBranchQueuePage.bind(this);
        this._renderPullRequestPage = this._renderPullRequestPage.bind(this);
    }

    render() {
        const { baseUrl } = this.props;

        return (
            <Switch>
                <Route
                    exact
                    path={`${baseUrl}/:branch`}
                    render={this._renderBranchQueuePage}
                />
                <Route
                    exact
                    path={`${baseUrl}/:branch/:pullRequest`}
                    render={this._renderPullRequestPage}
                />
                <Route component={NotFound} />
            </Switch>
        );
    }

    _renderBranchQueuePage({ match: { params: { branch } } }) {
        const { repository, branchQueues, loadBranchQueue } = this.props;

        return (
            <BranchQueue
                repository={repository}
                branch={branch}
                queue={branchQueues[branch]}
                loadBranchQueue={() => loadBranchQueue(branch)}
            />
        );
    }

    _renderPullRequestPage({ match: { params: { branch, pullRequest: pullRequestString } } }) {
        const {
            user,
            repository,
            pullRequests,
            pullRequestsRequest,
            branchQueues,
            loadUser,
            loadBranchQueue,
            loadPullRequests,
            onAddToBranchQueue,
            onRemoveFromBranchQueue,
        } = this.props;
        const pullRequestNumber = parseInt(pullRequestString, 10);
        const pullRequest = pullRequests[pullRequestNumber];
        const queue = branchQueues[branch];
        const queueItem = queue ? findPullRequestQueueItem(pullRequestNumber, queue) : null;
        const pullRequestRequest = isMade(pullRequestsRequest) && !pullRequest
            ? createWithError('Not Found')
            : pullRequestsRequest;

        return (
            <PullRequestPage
                user={user}
                repository={repository}
                branch={branch}
                pullRequest={pullRequest}
                pullRequestRequest={pullRequestRequest}
                branchQueue={queue}
                loadUser={loadUser}
                loadPullRequests={() => loadPullRequests()}
                loadBranchQueue={() => loadBranchQueue(branch)}
                onAddToBranchQueue={() => onAddToBranchQueue(branch, pullRequestNumber)}
                onRemoveFromBranchQueue={() => onRemoveFromBranchQueue(branch, queueItem)}
            />
        );
    }
}

Repository.propTypes = propTypes;
Repository.defaultProps = defaultProps;

const isLoadingNeeded = ({ repositoryRequest }) => !isMade(repositoryRequest);
const load = ({ loadRepository }) => loadRepository();

export default compose(
    branch(
        compose(isErrored, prop('repositoryRequest')),
        renderComponent(NotFound),
    ),
    withPreloading(isLoadingNeeded, load),
)(Repository);
