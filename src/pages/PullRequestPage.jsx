import prop from 'ramda/src/prop';
import compose from 'ramda/src/compose';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { branch, renderComponent, setPropTypes, defaultProps } from 'recompose';

import noop from '../helpers/noop';
import { requestShape, isMade, isErrored } from '../helpers/request';
import withPreloading from '../hocs/withPreloading';
import NotFound from './NotFound';

import { userShape, repositoryShape, queueShape, pullRequestShape } from '../constants/propTypes';

import PullRequest from '../components/PullRequest';
import BranchName from '../components/BranchName';

const propTypes = {
    pullRequest: pullRequestShape,
    pullRequestRequest: requestShape,
    repository: repositoryShape,
    branch: PropTypes.string.isRequired,
    loadPullRequests: PropTypes.func,
    onAddToBranchQueue: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
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

const load = ({ pullRequestRequest, user, branchQueue, loadPullRequests, loadUser, loadBranchQueue }) => {
    !isMade(pullRequestRequest) && loadPullRequests();
    !user && loadUser();
    !branchQueue && loadBranchQueue();
}

export default compose(
    defaultProps({
        loadPullRequests: noop,
        onAddToBranchQueue: noop,
        onRemoveFromBranchQueue: noop,
        loadBranchQueue: noop,
        loadUser: noop,
    }),
    setPropTypes(propTypes),
    branch(
        compose(isErrored, prop('pullRequestRequest')),
        renderComponent(NotFound),
    ),
    withPreloading(isLoadingNeeded, load),
)(PullRequestPage);
