import { branch, renderComponent } from 'recompose';
import React from 'react';
import PropTypes from 'prop-types';

import { queueShape } from '../constants/propTypes';

const propTypes = {
    queue: queueShape.isRequired,
    owner: PropTypes.string.isRequired,
    repository: PropTypes.string.isRequired,
};

const queueIsEmpty = ({ queue }) => queue.length === 0;

const EmptyQueue = () => (
    <p>No one in this queue</p>
)

const NotEmptyQueue = ({ owner, repository, queue }) => (
    <div>
        <ul>
            {queue.map(({ pullRequestNumber, username }) => (
                <li key={pullRequestNumber} style={{ marginBottom: '0.25em' }}>
                    <a href={`https://github.com/${username}`}>
                        <img
                            src={`https://github.com/${username}.png?size=100`}
                            alt={username}
                            width={50}
                            height={50}
                            style={{ verticalAlign: 'middle' }}
                        />
                    </a>
                    <a
                        href={`https://github.com/${owner}/${repository}/pull/${pullRequestNumber}`}
                        style={{ marginLeft: '0.5em' }}
                    >
                        #{pullRequestNumber}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

NotEmptyQueue.propTypes = propTypes;

const Queue = branch(
    queueIsEmpty,
    renderComponent(EmptyQueue),
)(NotEmptyQueue);

Queue.propTypes = propTypes;

export default Queue;
