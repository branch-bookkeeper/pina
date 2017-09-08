import propEq from 'ramda/src/propEq';
import isEmpty from 'ramda/src/isEmpty';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import noop from '../helpers/noop';
import findPullRequestQueueItem from '../helpers/findPullRequestQueueItem';

const propTypes = {
    pullRequest: PropTypes.object,
    owner: PropTypes.string.isRequired,
    repository: PropTypes.string.isRequired,
    branch: PropTypes.string.isRequired,
    pullRequestNumber: PropTypes.number.isRequired,
    loadPullRequests: PropTypes.func,
    onAddToQueue: PropTypes.func,
    onRemoveFromQueue: PropTypes.func,
    queue: PropTypes.array,
    loadBranchQueue: PropTypes.func,
    user: PropTypes.object,
    loadUser: PropTypes.func,
};

const defaultProps = {
    loadPullRequests: noop,
    onAddToQueue: noop,
    onRemoveFromQueue: noop,
    loadBranchQueue: noop,
    loadUser: noop,
}

const isQueueItemOwnedBy = propEq('username');

class PullRequest extends PureComponent {
    componentDidMount() {
        const { pullRequest, loadPullRequests, queue, loadBranchQueue, user, loadUser } = this.props;

        !user && loadUser();
        !pullRequest && loadPullRequests();
        !queue && loadBranchQueue();
    }

    render() {
        const {
            owner,
            repository,
            branch,
            pullRequest,
            pullRequestNumber,
            queue,
            user,
        } = this.props;

        return (
            <div>
                <h1>{owner}/{repository}/{branch} #{pullRequestNumber}</h1>
                {pullRequest &&
                    <h2>{pullRequest.title} by {pullRequest.user.login}</h2>}
                {pullRequest && user && queue && this._renderAction()}
            </div>
        );
    }

    _renderAction() {
        const {
            onAddToQueue,
            onRemoveFromQueue,
            user,
            queue,
            pullRequestNumber,
        } = this.props;

        const queueItem = findPullRequestQueueItem(pullRequestNumber, queue);
        const isUserInQueue = isQueueItemOwnedBy(user.login, queueItem);

        return (
            <span>
                { isEmpty(queueItem) && (<button onClick={onAddToQueue}>Book as {user.login}</button>) }
                { isUserInQueue && (<button onClick={onRemoveFromQueue}>Cancel</button>) }
            </span>
        );
    }
}

PullRequest.propTypes = propTypes;
PullRequest.defaultProps = defaultProps;

export default PullRequest;
