import propEq from 'ramda/src/propEq';
import { branch, renderComponent } from 'recompose';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import { requestShape, isNotMade } from '../helpers/request';
import { userShape, repositoryShape, queueShape, pullRequestShape } from '../constants/propTypes';
import QueueItemCard from './QueueItemCard';
import QueueItemMenu from './QueueItemMenu';
import EmptyQueue from './EmptyQueue';

const propTypes = {
    user: userShape.isRequired,
    queue: queueShape.isRequired,
    repository: repositoryShape.isRequired,
    pullRequests: PropTypes.objectOf(pullRequestShape),
    removeFromBranchQueueRequest: requestShape,
    onRemoveFromBranchQueue: PropTypes.func,
    showLinkToAddItems: PropTypes.bool,
};

const isQueueItemOwnedBy = propEq('username');

const queueIsEmpty = ({ queue }) => queue.length === 0;

const shouldRenderMenu = (user, repository, queueItem) => {
    const isUserInQueue = queueItem && isQueueItemOwnedBy(user.login, queueItem);
    const isUserAdmin = repository.permissions.admin;

    return isUserAdmin || isUserInQueue;
};

class NotEmptyQueue extends Component {
    state = {
        queueItemToRemove: null,
    };

    render() {
        const {
            user,
            repository,
            pullRequests,
            queue,
            removeFromBranchQueueRequest,
        } = this.props;
        const { queueItemToRemove } = this.state;

        return (
            <Grid container direction="column" spacing={8}>
                {queue.map((queueItem, index) => (
                    <Grid item style={{width: '100%'}} key={queueItem.pullRequestNumber}>
                        <QueueItemCard
                            index={index}
                            queueItem={queueItem}
                            pullRequest={pullRequests[queueItem.pullRequestNumber]}
                            renderMenu={menuProps =>
                                shouldRenderMenu(user, repository, queueItem) && (
                                    <QueueItemMenu
                                        onRemoveFromBranchQueue={() => this.handleRemove(queueItem)}
                                        {...menuProps}
                                    />
                                )
                            }
                            loading={
                                queueItemToRemove
                                && !isNotMade(removeFromBranchQueueRequest)
                                && queueItem.pullRequestNumber === queueItemToRemove.pullRequestNumber
                            }
                        />
                    </Grid>
                ))}
            </Grid>
        );
    }

    handleRemove = (queueItem) => {
        this.setState({
            queueItemToRemove: queueItem,
        });

        this.props.onRemoveFromBranchQueue(queueItem);
    }
}

NotEmptyQueue.propTypes = propTypes;

const Queue = branch(
    queueIsEmpty,
    renderComponent(EmptyQueue),
)(NotEmptyQueue);

Queue.propTypes = propTypes;

export default Queue;
