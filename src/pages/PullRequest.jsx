import always from 'ramda/src/always';
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
};

const defaultProps = {
    loadPullRequests: noop,
    onAddToQueue: noop,
    onRemoveFromQueue: noop,
}

class PullRequest extends PureComponent {
    componentDidMount() {
        const { pullRequest, loadPullRequests } = this.props;

        !pullRequest && loadPullRequests();
    }

    render() {
        const {
            owner,
            repository,
            branch,
            pullRequest,
            pullRequestNumber,
            onAddToQueue,
            onRemoveFromQueue
        } = this.props;

        return (
            <div>
                <h1>{owner}/{repository}/{branch} #{pullRequestNumber}</h1>
                {pullRequest &&
                    <h2>{pullRequest.title} by {pullRequest.user.login}</h2>}
                <button onClick={onAddToQueue}>Book</button>
                <button onClick={onRemoveFromQueue}>Cancel</button>
            </div>
        );
    }
}

PullRequest.propTypes = propTypes;
PullRequest.defaultProps = defaultProps;

export default PullRequest;
