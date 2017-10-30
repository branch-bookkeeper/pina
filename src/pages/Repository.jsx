import compose from 'ramda/src/compose';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import isNil from 'ramda/src/isNil';
import { branch, renderComponent } from 'recompose';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import noop from '../helpers/noop';
import { requestShape, isNotMade, isMade, isErrored } from '../helpers/request';
import findPullRequestQueueItem from '../helpers/findPullRequestQueueItem';
import { userShape, installationShape, repositoryShape, queueShape, pullRequestShape } from '../constants/propTypes';
import withPreloading from '../hocs/withPreloading';
import renderNothingIf from '../hocs/renderNothingIf';

import QueueCancelConfirmDialog from '../components/QueueCancelConfirmDialog';

import PullRequestPage from './PullRequestPage';
import BranchQueue from './BranchQueue';
import NotFound from './NotFound';

const propTypes = {
    baseUrl: PropTypes.string.isRequired,
    user: userShape,
    installation: installationShape,
    repository: repositoryShape,
    branchQueues: PropTypes.objectOf(queueShape).isRequired,
    pullRequests: PropTypes.objectOf(pullRequestShape).isRequired,
    requests: PropTypes.objectOf(requestShape).isRequired,
    loadUser: PropTypes.func,
    loadInstallation: PropTypes.func,
    loadRepository: PropTypes.func,
    loadBranchQueue: PropTypes.func,
    loadPullRequests: PropTypes.func,
    onAddToBranchQueue: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
};

const defaultProps = {
    loadInstallation: noop,
    loadRepository: noop,
};

class Repository extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queueItemToRemove: null,
            queueItemToRemoveBranch: null,
            isRemoveConfirmDialogOpen: false,
        };

        this.handleQueueItemDelete = this.handleQueueItemDelete.bind(this);
        this.canDeleteQueueItem = this.canDeleteQueueItem.bind(this);
        this.isDeletingQueueItem = this.isDeletingQueueItem.bind(this);
        this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
        this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
        this._renderBranchQueuePage = this._renderBranchQueuePage.bind(this);
        this._renderPullRequestPage = this._renderPullRequestPage.bind(this);
    }

    render() {
        const { baseUrl, user } = this.props;
        const {
            queueItemToRemove,
            isRemoveConfirmDialogOpen,
        } = this.state;

        return (
            <div>
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
                {queueItemToRemove &&
                    <QueueCancelConfirmDialog
                        open={isRemoveConfirmDialogOpen}
                        queueItemToRemove={queueItemToRemove}
                        currentUser={user}
                        onCancel={this.handleDeleteCancel}
                        onConfirm={this.handleDeleteConfirm}
                    />}
            </div>
        );
    }

    _renderBranchQueuePage({ match: { params: { branch } } }) {
        const {
            user,
            repository,
            branchQueues,
            loadUser,
            loadBranchQueue,
        } = this.props;

        return (
            <BranchQueue
                user={user}
                repository={repository}
                branch={branch}
                queue={branchQueues[branch]}
                loadUser={loadUser}
                loadBranchQueue={() => loadBranchQueue(branch)}
                onRemoveFromBranchQueue={queueItem => this.handleQueueItemDelete(branch, queueItem)}
                canRemoveFromBranchQueue={this.canDeleteQueueItem}
                isRemovingFromBranchQueue={this.isDeletingQueueItem}
            />
        );
    }

    _renderPullRequestPage({ match: { params: { branch, pullRequest: pullRequestString } } }) {
        const {
            user,
            repository,
            pullRequests,
            branchQueues,
            requests: { pullRequests: pullRequestsRequest, ...requests },
            loadUser,
            loadBranchQueue,
            loadPullRequests,
            onAddToBranchQueue,
        } = this.props;
        const pullRequestNumber = parseInt(pullRequestString, 10);
        const pullRequest = pullRequests[pullRequestNumber];
        const queue = branchQueues[branch];
        const queueItem = queue ? findPullRequestQueueItem(pullRequestNumber, queue) : null;
        const addToBranchQueueRequest = requests[`queue.add/${branch}`];
        const removeFromBranchQueueRequest = requests[`queue.delete/${branch}`];

        return (
            <PullRequestPage
                user={user}
                repository={repository}
                branch={branch}
                pullRequest={pullRequest}
                pullRequestRequest={pullRequestsRequest}
                branchQueue={queue}
                addToBranchQueueRequest={addToBranchQueueRequest}
                removeFromBranchQueueRequest={removeFromBranchQueueRequest}
                loadUser={loadUser}
                loadPullRequest={loadPullRequests}
                loadBranchQueue={() => loadBranchQueue(branch)}
                onAddToBranchQueue={() => onAddToBranchQueue(branch, pullRequestNumber)}
                onRemoveFromBranchQueue={() => this.handleQueueItemDelete(branch, queueItem)}
            />
        );
    }

    handleQueueItemDelete(branch, queueItemToRemove) {
        this.setState({
            isRemoveConfirmDialogOpen: true,
            queueItemToRemoveBranch: branch,
            queueItemToRemove,
        });
    }

    canDeleteQueueItem(queueItem) {
        const { user, repository } = this.props;

        return repository.permissions.admin || queueItem.username === user.login;
    }

    isDeletingQueueItem(queueItem) {
        const { requests } = this.props;
        const { queueItemToRemove, queueItemToRemoveBranch } = this.state;
        const removeFromBranchQueueRequest = requests[`queue.delete/${queueItemToRemoveBranch}`];

        return !isNotMade(removeFromBranchQueueRequest)
            && queueItem === queueItemToRemove;
    }

    handleDeleteCancel() {
        this.setState({
            isRemoveConfirmDialogOpen: false,
        });
    }

    handleDeleteConfirm() {
        const { onRemoveFromBranchQueue } = this.props;
        const { queueItemToRemove, queueItemToRemoveBranch } = this.state;

        this.setState({
            isRemoveConfirmDialogOpen: false,
        });
        onRemoveFromBranchQueue(queueItemToRemoveBranch, queueItemToRemove);
    }
}

Repository.propTypes = propTypes;
Repository.defaultProps = defaultProps;

const isInstallationLoadingNeeded = ({ requests: { installation: installationRequest }, user }) =>
    !isMade(installationRequest);

const loadInstallation = ({ requests: { installation: installationRequest }, loadInstallation }) =>
    loadInstallation();

const isRepositoryLoadingNeeded = ({ requests: { repository: repositoryRequest }, user }) =>
    !isMade(repositoryRequest) || !user;

const loadRepository = ({ requests: { repository: repositoryRequest }, loadRepository }) => {
    !isMade(repositoryRequest) && loadRepository();
}

export default compose(
    branch(
        compose(isErrored, path(['requests', 'repository'])),
        renderComponent(NotFound),
    ),
    withPreloading(isInstallationLoadingNeeded, loadInstallation),
    renderNothingIf(compose(isNil, prop('installation'))),
    withPreloading(isRepositoryLoadingNeeded, loadRepository),
)(Repository);
