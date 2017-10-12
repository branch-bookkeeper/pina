import React from 'react';
import PropTypes from 'prop-types';
import { setPropTypes } from 'recompose';
import { OpenInNew } from 'material-ui-icons';

import { requestShape } from '../helpers/request';
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
    addToBranchQueueRequest: requestShape,
    removeFromBranchQueueRequest: requestShape,
};

const AlignedOpenInNew = () => <OpenInNew style={{ verticalAlign: 'middle' }} />;

const PullRequest = ({
    pullRequest,
    repository,
    branch,
    branchQueue,
    user,
    onAddToBranchQueue,
    onRemoveFromBranchQueue,
    addToBranchQueueRequest,
    removeFromBranchQueueRequest,
}) => (
    <div>
        <h1>
            <a href={pullRequest.humanUrl}>
                {pullRequest.title} #{pullRequest.pullRequestNumber} <AlignedOpenInNew />
            </a>
        </h1>
        <h2>
            <a href={repository.html_url}>
                {repository.full_name} <AlignedOpenInNew />
            </a>
        </h2>
        <PullRequestActions
            pullRequest={pullRequest}
            repository={repository}
            branchQueue={branchQueue}
            user={user}
            onAddToBranchQueue={onAddToBranchQueue}
            onRemoveFromBranchQueue={onRemoveFromBranchQueue}
            addToBranchQueueRequest={addToBranchQueueRequest}
            removeFromBranchQueueRequest={removeFromBranchQueueRequest}
        />
    </div>
);

export default setPropTypes(propTypes)(PullRequest);
