import prop from 'ramda/src/prop';
import compose from 'ramda/src/compose';
import isNil from 'ramda/src/isNil';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { branch, renderComponent, setPropTypes, defaultProps } from 'recompose';

import noop from '../helpers/noop';
import { requestShape, isMade, isErrored } from '../helpers/request';
import withPreloading from '../hocs/withPreloading';
import renderNothingIf from '../hocs/renderNothingIf';
import NotFound from './NotFound';

import { userShape, repositoryShape, queueShape, pullRequestShape } from '../constants/propTypes';

import PullRequest from '../components/PullRequest';
import BranchName from '../components/BranchName';

const propTypes = {
    pullRequest: pullRequestShape,
    pullRequestRequest: requestShape,
    repository: repositoryShape,
    branch: PropTypes.string.isRequired,
    loadPullRequest: PropTypes.func,
    onAddToBranchQueue: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
    addToBranchQueueRequest: requestShape,
    removeFromBranchQueueRequest: requestShape,
    branchQueue: queueShape,
    loadBranchQueue: PropTypes.func,
    user: userShape,
    loadUser: PropTypes.func,
};

const PullRequestPage = ({
    repository,
    branch,
    branchQueue,
    pullRequest,
    user,
    onAddToBranchQueue,
    onRemoveFromBranchQueue,
    addToBranchQueueRequest,
    removeFromBranchQueueRequest,
}) => (
    <div>
        <Link to="/">&laquo; Home</Link>
        <PullRequest
            repository={repository}
            branch={branch}
            branchQueue={branchQueue}
            pullRequest={pullRequest}
            user={user}
            onAddToBranchQueue={onAddToBranchQueue}
            onRemoveFromBranchQueue={onRemoveFromBranchQueue}
            addToBranchQueueRequest={addToBranchQueueRequest}
            removeFromBranchQueueRequest={removeFromBranchQueueRequest}
        />
        <div>
            <Link to={`/${repository.full_name}/${branch}`}>
                Go to <BranchName branch={branch} /> queue
            </Link>
        </div>
    </div>
);

const isLoadingNeeded = ({ pullRequestRequest, user, branchQueue }) =>
    !isMade(pullRequestRequest)
    || !user
    || !branchQueue;

const load = ({ pullRequestRequest, user, branchQueue, loadPullRequest, loadUser, loadBranchQueue }) => {
    !isMade(pullRequestRequest) && loadPullRequest();
    !user && loadUser();
    !branchQueue && loadBranchQueue();
}

export default compose(
    defaultProps({
        loadPullRequest: noop,
        onAddToBranchQueue: noop,
        onRemoveFromBranchQueue: noop,
        loadBranchQueue: noop,
        loadUser: noop,
    }),
    setPropTypes(propTypes),
    withPreloading(isLoadingNeeded, load),
    branch(
        compose(isErrored, prop('pullRequestRequest')),
        renderComponent(NotFound),
    ),
    // Account for a temporary misalignment between network request state and entity being present.
    renderNothingIf(compose(isNil, prop('pullRequest'))),
)(PullRequestPage);
