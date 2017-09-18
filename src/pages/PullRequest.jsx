import prop from 'ramda/src/prop';
import propEq from 'ramda/src/propEq';
import isEmpty from 'ramda/src/isEmpty';
import compose from 'ramda/src/compose';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { branch, renderComponent } from 'recompose';

import noop from '../helpers/noop';
import { requestShape, isNotMade, isErrored } from '../helpers/request';
import findPullRequestQueueItem from '../helpers/findPullRequestQueueItem';
import withPreloading from '../hocs/withPreloading';
import NotFound from './NotFound';

import { userShape, repositoryShape, queueShape, pullRequestShape } from '../constants/propTypes';

const propTypes = {
    pullRequest: pullRequestShape,
    pullRequestRequest: requestShape.isRequired,
    repository: repositoryShape.isRequired,
    branch: PropTypes.string.isRequired,
    loadPullRequests: PropTypes.func,
    onAddToBranchQueue: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
    branchQueue: queueShape,
    loadBranchQueue: PropTypes.func,
    user: userShape,
    loadUser: PropTypes.func,
};

const defaultProps = {
    loadPullRequests: noop,
    onAddToBranchQueue: noop,
    onRemoveFromBranchQueue: noop,
    loadBranchQueue: noop,
    loadUser: noop,
}

const isQueueItemOwnedBy = propEq('username');

class PullRequest extends PureComponent {
    render() {
        const {
            repository: { full_name: repoFullName },
            branch,
            pullRequest,
            branchQueue,
            user,
        } = this.props;

        return (
            <div>
                <Link to="/">&laquo; Home</Link>
                {pullRequest &&
                    <h1>{repoFullName}/{branch} #{pullRequest.number}</h1>}
                {pullRequest &&
                    <h2>{pullRequest.title} by {pullRequest.user.login}</h2>}
                {pullRequest && user && branchQueue && this._renderAction()}
                <div>
                    <Link to={`/${repoFullName}/${branch}`}>Go to {branch} queue</Link>
                </div>
            </div>
        );
    }

    _renderAction() {
        const {
            onAddToBranchQueue,
            onRemoveFromBranchQueue,
            user,
            branchQueue,
            pullRequest,
        } = this.props;

        const queueItem = findPullRequestQueueItem(pullRequest.number, branchQueue);
        const isUserInQueue = isQueueItemOwnedBy(user.login, queueItem);
        const style = {
            fontSize: '1.5em',
            padding: '0.5em 1em',
            margin: '0.5em 0.5em 1em 0.5em',
        };

        return (
            <span>
                {isEmpty(queueItem) &&
                    <button onClick={onAddToBranchQueue} style={style}>Book as {user.login}</button>}
                {isUserInQueue &&
                    <button onClick={onRemoveFromBranchQueue} style={style}>Cancel</button>}
            </span>
        );
    }
}

PullRequest.propTypes = propTypes;
PullRequest.defaultProps = defaultProps;

const isLoadingNeeded = ({ pullRequestRequest, user, branchQueue }) =>
    isNotMade(pullRequestRequest)
    || !user
    || !branchQueue;

const load = ({ pullRequestRequest, user, branchQueue, loadPullRequests, loadUser, loadBranchQueue }) => {
    isNotMade(pullRequestRequest) && loadPullRequests();
    !user && loadUser();
    !branchQueue && loadBranchQueue();
}

export default compose(
    branch(
        compose(isErrored, prop('pullRequestRequest')),
        renderComponent(NotFound),
    ),
    withPreloading(isLoadingNeeded, load),
)(PullRequest);
