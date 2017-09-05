import always from 'ramda/src/always';
import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';
import defaultTo from 'ramda/src/defaultTo';
import isEmpty from 'ramda/src/isEmpty';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const noop = always(undefined);

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
};

const defaultProps = {
    loadPullRequests: noop,
    onAddToQueue: noop,
    onRemoveFromQueue: noop,
    loadBranchQueue: noop,
}

const findPullRequestQueueItem = (pullRequestNumber, queue) =>
    defaultTo({}, find(propEq('pullRequestNumber', pullRequestNumber), queue));

const isQueueItemOwnedBy = propEq('username');

class PullRequest extends PureComponent {
    componentDidMount() {
        const { pullRequest, loadPullRequests, queue, loadBranchQueue } = this.props;

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
        } = this.props;

        return (
            <div>
                <h1>{owner}/{repository}/{branch} #{pullRequestNumber}</h1>
                {pullRequest &&
                    <h2>{pullRequest.title} by {pullRequest.user.login}</h2>}
                {queue && this._renderAction()}
            </div>
        );
    }

    _renderAction() {
        const {
            onAddToQueue,
            onRemoveFromQueue,
            queue,
            pullRequestNumber,
        } = this.props;

        const queueItem = findPullRequestQueueItem(pullRequestNumber, queue);
        const isUserInQueue = isQueueItemOwnedBy('mattiaocchiuto', queueItem);

        return (
            <span>
                { isEmpty(queueItem) && (<button onClick={onAddToQueue}>Book</button>) }
                { isUserInQueue && (<button onClick={onRemoveFromQueue}>Cancel</button>) }
            </span>
        );
    }
}

PullRequest.propTypes = propTypes;
PullRequest.defaultProps = defaultProps;

export default PullRequest;
