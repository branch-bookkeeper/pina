import propEq from 'ramda/src/propEq';
import isNil from 'ramda/src/isNil';
import React from 'react';
import PropTypes from 'prop-types';
import { setPropTypes } from 'recompose';

import { requestShape, isNotMade } from '../helpers/request';
import { repositoryShape, queueItemShape, userShape } from '../constants/propTypes';

const isQueueItemOwnedBy = propEq('username');

const propTypes = {
    repository: repositoryShape.isRequired,
    queueItem: queueItemShape,
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
        queueItem,
        repository,
        addToBranchQueueRequest,
        removeFromBranchQueueRequest,
    } = props;

    const isUserInQueue = queueItem && isQueueItemOwnedBy(user.login, queueItem);
    const isUserAdmin = repository.permissions.admin;
    const bookingInProgress = !isNotMade(addToBranchQueueRequest);
    const cancelInProgress = !isNotMade(removeFromBranchQueueRequest);
    const requestInProgress = bookingInProgress || cancelInProgress;

    return (
        <div>
            {isUserInQueue &&
                <button disabled style={buttonStyle}>You are in queue to merge</button>}
            {!isNil(queueItem) && !isUserInQueue &&
                <button disabled style={buttonStyle}><strong>{queueItem.username}</strong> is in queue to merge</button>}
            {bookingInProgress &&
                <button style={buttonStyle} disabled>Booking...</button>}
            {cancelInProgress &&
                <div><button style={buttonStyle} disabled>Cancelling...</button></div>}
            {!requestInProgress && isNil(queueItem) &&
                <button onClick={onAddToBranchQueue} style={buttonStyle}>Book as {user.login}</button>}
            {!requestInProgress && isUserInQueue &&
                <div>
                    <button onClick={onRemoveFromBranchQueue} style={buttonStyle}>Cancel</button>
                    <span>Click to cancel this booking</span>
                </div>}
            {!requestInProgress && !isNil(queueItem) && !isUserInQueue && isUserAdmin &&
                <div>
                    <button onClick={onRemoveFromBranchQueue} style={dangerButtonStyle}>Cancel</button>
                    <span>Use your administrative privileges to cancel this booking</span>
                </div>}
        </div>
    );
};

export default setPropTypes(propTypes)(PullRequestActions);
