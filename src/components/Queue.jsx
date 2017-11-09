import any from 'ramda/src/any';
import { branch, renderComponent } from 'recompose';
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import IconButton from 'material-ui/IconButton';
import DeleteForever from 'material-ui-icons/DeleteForever';
import Grid from 'material-ui/Grid';

import { repositoryShape, queueShape, pullRequestShape } from '../constants/propTypes';
import QueueItemCard from './QueueItemCard';

const propTypes = {
    queue: queueShape.isRequired,
    repository: repositoryShape.isRequired,
    pullRequests: PropTypes.objectOf(pullRequestShape),
    canDeleteItem: PropTypes.func,
    isDeletingItem: PropTypes.func,
    onDeleteItem: PropTypes.func,
};

const queueIsEmpty = ({ queue }) => queue.length === 0;

const EmptyQueue = () => (
    <p>No one in this queue</p>
)

const renderDeleteButton = ({
    queueItem,
    isDeletingThisItem,
    isDeletingAnotherItem,
    onDeleteItem,
}) => (
    <span>
        {!isDeletingThisItem &&
            <IconButton
                color={'accent'}
                style={{ verticalAlign: 'middle' }}
                disabled={isDeletingAnotherItem}
                onClick={onDeleteItem}
            >
                <DeleteForever />
            </IconButton>}
        {isDeletingThisItem &&
            <span
                style={{
                    display: 'inline-block',
                    paddingLeft: '12px',
                    verticalAlign: 'middle',
                }}
            >
                <CircularProgress
                    size={24}
                />
            </span>}
    </span>
);

const NotEmptyQueue = ({
    repository: { full_name: repoFullName },
    pullRequests,
    queue,
    canDeleteItem,
    isDeletingItem,
    onDeleteItem,
}) => {
    const isDeletingAnyItem = any(isDeletingItem, queue);

    return (
        <Grid container direction="column" spacing={8}>
            {queue.map((queueItem, index) => (
                <Grid item style={{width: '100%'}} key={queueItem.pullRequestNumber}>
                    <QueueItemCard
                        index={index}
                        queueItem={queueItem}
                        pullRequest={pullRequests[queueItem.pullRequestNumber]}
                    >
                        {canDeleteItem(queueItem) && renderDeleteButton({
                            isDeletingThisItem: isDeletingItem(queueItem),
                            isDeletingAnotherItem: isDeletingAnyItem && !isDeletingItem(queueItem),
                            onDeleteItem: () => onDeleteItem(queueItem),
                            queueItem,
                        })}
                    </QueueItemCard>
                </Grid>
            ))}
        </Grid>
    );
}

NotEmptyQueue.propTypes = propTypes;

const Queue = branch(
    queueIsEmpty,
    renderComponent(EmptyQueue),
)(NotEmptyQueue);

Queue.propTypes = propTypes;

export default Queue;
