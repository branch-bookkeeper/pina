import propEq from 'ramda/src/propEq';
import isNil from 'ramda/src/isNil';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { requestShape, isNotMade } from '../lib/request';
import { repositoryShape, queueItemShape, userShape } from '../constants/propTypes';

const isQueueItemOwnedBy = propEq('username');

const propTypes = {
    repository: repositoryShape.isRequired,
    queueItem: queueItemShape,
    user: userShape.isRequired,
    onCancel: PropTypes.func,
    onAddToBranchQueue: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
    addToBranchQueueRequest: requestShape,
    removeFromBranchQueueRequest: requestShape,
};

const styles = (theme) => ({
    root: {
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        textAlign: 'center',
    },
    cancelButton: {
        marginLeft: theme.spacing.unit,
    },
});

const PullRequestActions = (props) => {
    const {
        classes,
        onCancel,
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
        <div className={classes.root}>
            {bookingInProgress &&
                <div>
                    <Button color="primary" variant="contained" disabled>Adding...</Button>
                    <Button variant="outline" className={classes.cancelButton} disabled>Cancel</Button>
                </div>}
            {cancelInProgress &&
                <div>
                    <Button color="primary" disabled>Removing...</Button>
                    <Button variant="outline" className={classes.cancelButton} disabled>Cancel</Button>
                </div>}
            {!requestInProgress && isUserInQueue &&
                <div>
                    <Button color="primary" variant="contained" onClick={onAddToBranchQueue}>Add to queue</Button>
                    <Button variant="outline" className={classes.cancelButton} onClick={onCancel}>Cancel</Button>
                </div>}
            {!requestInProgress && !isNil(queueItem) && !isUserInQueue && isUserAdmin &&
                <div>
                    <Button color="primary" onClick={onRemoveFromBranchQueue}>Remove from queue</Button>
                    <Button variant="outline" className={classes.cancelButton} onClick={onCancel}>Cancel</Button>
                </div>}
        </div>
    );
};

PullRequestActions.propTypes = propTypes;

export default withStyles(styles)(PullRequestActions);
