import React from 'react';
import PropTypes from 'prop-types';
import { setPropTypes } from 'recompose';

import { pullRequestShape, repositoryShape, queueShape, userShape } from '../constants/propTypes';

import PullRequestActions from './PullRequestActions';

const propTypes = {
    pullRequest: pullRequestShape.isRequired,
    repository: repositoryShape.isRequired,
    branch: PropTypes.string.isRequired,
    branchQueue: queueShape.isRequired,
    user: userShape.isRequired,
    onAddToBranchQueue: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
};

const PullRequest = ({
    pullRequest,
    repository,
    branch,
    branchQueue,
    user,
    onAddToBranchQueue,
    onRemoveFromBranchQueue,
}) => (
    <div>
        <h1>{repository.full_name}/{branch} #{pullRequest.number}</h1>
        <h2>{pullRequest.title} by {pullRequest.user.login}</h2>
        <PullRequestActions
            pullRequest={pullRequest}
            repository={repository}
            branchQueue={branchQueue}
            user={user}
            onAddToBranchQueue={onAddToBranchQueue}
            onRemoveFromBranchQueue={onRemoveFromBranchQueue}
        />
    </div>
);

export default setPropTypes(propTypes)(PullRequest);
