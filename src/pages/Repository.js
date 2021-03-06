import {
    compose,
    path,
 } from 'ramda';
import { branch, renderComponent } from 'recompose';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import noop from '../lib/noop';
import { requestShape, isNotMade, isMade, isErrored } from '../lib/request';
import { userShape, repositoryShape, queueShape, pullRequestShape } from '../constants/propTypes';
import withPreloading from '../hocs/withPreloading';

import QueueCancelConfirmDialog from '../components/QueueCancelConfirmDialog';

import BranchQueue from './BranchQueue';
import NotFound from './NotFound';

const propTypes = {
    baseUrl: PropTypes.string.isRequired,
    user: userShape,
    repository: repositoryShape,
    branchQueues: PropTypes.objectOf(queueShape).isRequired,
    pullRequests: PropTypes.objectOf(pullRequestShape).isRequired,
    requests: PropTypes.objectOf(requestShape).isRequired,
    loadUser: PropTypes.func,
    loadRepository: PropTypes.func,
    loadBranchQueue: PropTypes.func,
    loadPullRequests: PropTypes.func,
    startQueueUpdates: PropTypes.func,
    stopQueueUpdates: PropTypes.func,
    onAddToBranchQueue: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
};

const defaultProps = {
    loadInstallation: noop,
    loadRepository: noop,
    startQueueUpdates: noop,
    stopQueueUpdates: noop,
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
                        path={`${baseUrl}/:branch/:pullRequestNumber?`}
                        render={this._renderBranchQueuePage}
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

    _renderBranchQueuePage({ match: { params: { branch, pullRequestNumber } } }) {
        const {
            user,
            repository,
            pullRequests,
            branchQueues,
            requests: {
                pullRequests: pullRequestsRequest,
                [`queue.add/${branch}`]: addToBranchQueueRequest,
                [`queue.delete/${branch}`]: removeFromBranchQueueRequest,
            },
            loadUser,
            loadBranchQueue,
            loadPullRequests,
            startQueueUpdates,
            stopQueueUpdates,
            onAddToBranchQueue,
        } = this.props;

        return (
            <BranchQueue
                user={user}
                repository={repository}
                branch={branch}
                selectedPullRequest={pullRequests[pullRequestNumber]}
                pullRequests={pullRequests}
                queue={branchQueues[branch]}
                pullRequestsRequest={pullRequestsRequest}
                addToBranchQueueRequest={addToBranchQueueRequest}
                removeFromBranchQueueRequest={removeFromBranchQueueRequest}
                loadUser={loadUser}
                loadBranchQueue={() => loadBranchQueue(branch)}
                loadPullRequests={loadPullRequests}
                startQueueUpdates={() => startQueueUpdates(branch)}
                stopQueueUpdates={() => stopQueueUpdates(branch)}
                onAddToBranchQueue={pullRequestNumber => onAddToBranchQueue(branch, pullRequestNumber)}
                onRemoveFromBranchQueue={queueItem => this.handleQueueItemDelete(branch, queueItem)}
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

const isLoadingNeeded = ({ requests: { repository: repositoryRequest }, user }) =>
    !user || !isMade(repositoryRequest);

const load = ({ loadRepository }) => {
    loadRepository();
}

export default compose(
    branch(
        compose(isErrored, path(['requests', 'repository'])),
        renderComponent(NotFound),
    ),
    withPreloading(isLoadingNeeded, load),
)(Repository);
