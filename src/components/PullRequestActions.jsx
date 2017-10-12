import propEq from 'ramda/src/propEq';
import isEmpty from 'ramda/src/isEmpty';
import React from 'react';
import PropTypes from 'prop-types';
import { setPropTypes } from 'recompose';

import { requestShape, isNotMade } from '../helpers/request';
import { pullRequestShape, repositoryShape, queueShape, userShape } from '../constants/propTypes';
import findPullRequestQueueItem from '../helpers/findPullRequestQueueItem';

const isQueueItemOwnedBy = propEq('username');

const propTypes = {
    pullRequest: pullRequestShape.isRequired,
    repository: repositoryShape.isRequired,
    branchQueue: queueShape.isRequired,
    user: userShape.isRequired,
    onAddToBranchQueue: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
    addToBranchQueueRequest: requestShape,
    removeFromBranchQueueRequest: requestShape,
};

const buttonStyle = {
    fontSize: '1.5em',
    padding: '0.5em 1em',
    margin: '0.5em 0.5em 1em 0.5em',
};

const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'red',
};

const PullRequestActions = (props) => {
    const {
        onAddToBranchQueue,
        onRemoveFromBranchQueue,
        user,
        branchQueue,
        pullRequest,
        repository,
        addToBranchQueueRequest,
        removeFromBranchQueueRequest,
    } = props;

    const queueItem = findPullRequestQueueItem(pullRequest.pullRequestNumber, branchQueue);
    const isUserInQueue = isQueueItemOwnedBy(user.login, queueItem);
    const isUserAdmin = repository.permissions.admin;
    const bookingInProgress = !isNotMade(addToBranchQueueRequest);
    const cancelInProgress = !isNotMade(removeFromBranchQueueRequest);
    const requestInProgress = bookingInProgress || cancelInProgress;

    return (
        <div>
            {bookingInProgress &&
                <button style={buttonStyle} disabled>Booking...</button>}
            {cancelInProgress &&
                <button style={buttonStyle} disabled>Cancelling...</button>}
            {!requestInProgress && isEmpty(queueItem) &&
                <button onClick={onAddToBranchQueue} style={buttonStyle}>Book as {user.login}</button>}
            {!requestInProgress && isUserInQueue &&
                <button onClick={onRemoveFromBranchQueue} style={buttonStyle}>Cancel</button>}
            {!requestInProgress && !isEmpty(queueItem) && !isUserInQueue &&
                <button disabled style={buttonStyle}><strong>{queueItem.username}</strong> is in queue to merge</button>}
            {!requestInProgress && !isEmpty(queueItem) && !isUserInQueue && isUserAdmin &&
                <div>
                    <button onClick={onRemoveFromBranchQueue} style={dangerButtonStyle}>Cancel</button>
                    <span>Use your administrative privileges to cancel this booking</span>
                </div>}
        </div>
    );
};

export default setPropTypes(propTypes)(PullRequestActions);
