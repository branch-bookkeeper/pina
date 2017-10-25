import any from 'ramda/src/any';
import { branch, renderComponent } from 'recompose';
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import IconButton from 'material-ui/IconButton';
import OpenInNew from 'material-ui-icons/OpenInNew'
import DeleteForever from 'material-ui-icons/DeleteForever';

import { repositoryShape, queueShape } from '../constants/propTypes';

const AlignedOpenInNew = () => <OpenInNew style={{ verticalAlign: 'middle' }} />;

const propTypes = {
    queue: queueShape.isRequired,
    repository: repositoryShape.isRequired,
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
    queue,
    canDeleteItem,
    isDeletingItem,
    onDeleteItem,
}) => {
    const isDeletingAnyItem = any(isDeletingItem, queue);

    return (
        <ul>
            {queue.map(queueItem => (
                <li key={queueItem.pullRequestNumber} style={{ marginBottom: '0.25em' }}>
                    <a href={`https://github.com/${queueItem.username}`}>
                        <img
                            src={`https://github.com/${queueItem.username}.png?size=100`}
                            alt={queueItem.username}
                            width={50}
                            height={50}
                            style={{ verticalAlign: 'middle' }}
                        />
                    </a>
                    <a
                        href={`https://github.com/${repoFullName}/pull/${queueItem.pullRequestNumber}`}
                        style={{ marginLeft: '0.5em' }}
                    >
                        #{queueItem.pullRequestNumber} <AlignedOpenInNew />
                    </a>
                    {canDeleteItem(queueItem) && renderDeleteButton({
                        isDeletingThisItem: isDeletingItem(queueItem),
                        isDeletingAnotherItem: isDeletingAnyItem && !isDeletingItem(queueItem),
                        onDeleteItem: () => onDeleteItem(queueItem),
                        queueItem,
                    })}
                </li>
            ))}
        </ul>
    );
}

NotEmptyQueue.propTypes = propTypes;

const Queue = branch(
    queueIsEmpty,
    renderComponent(EmptyQueue),
)(NotEmptyQueue);

Queue.propTypes = propTypes;

export default Queue;
