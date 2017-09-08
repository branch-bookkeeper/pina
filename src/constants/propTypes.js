import PropTypes from 'prop-types';

export const queueItemShape = PropTypes.shape({
    pullRequestNumber: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
});

export const queueShape = PropTypes.arrayOf(queueItemShape);
