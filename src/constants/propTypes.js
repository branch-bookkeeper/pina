import PropTypes from 'prop-types';

export const userShape = PropTypes.shape({
    login: PropTypes.string.isRequired,
});

export const queueItemShape = PropTypes.shape({
    pullRequestNumber: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
});

export const queueShape = PropTypes.arrayOf(queueItemShape);

export const pullRequestShape = PropTypes.shape({
    statusUrl: PropTypes.string.isRequired,
    pullRequestNumber: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    assignees: PropTypes.arrayOf(PropTypes.string).isRequired,
    humanUrl: PropTypes.string.isRequired,
    installationId: PropTypes.number.isRequired,
});

export const installationShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    account: PropTypes.shape({
        login: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
});

export const repositoryShape = PropTypes.shape({
    name: PropTypes.string.isRequired,
    full_name: PropTypes.string.isRequired,
    default_branch: PropTypes.string.isRequired,
    html_url: PropTypes.string.isRequired,
    permissions: PropTypes.shape({
        admin: PropTypes.bool.isRequired,
        push: PropTypes.bool.isRequired,
        pull: PropTypes.bool.isRequired,
    }).isRequired,
});
