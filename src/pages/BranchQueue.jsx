import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Queue from '../components/Queue';

import { queueShape } from '../constants/propTypes';
import noop from '../helpers/noop';

class BranchQueue extends PureComponent {
    static propTypes = {
        owner: PropTypes.string.isRequired,
        repository: PropTypes.string.isRequired,
        branch: PropTypes.string.isRequired,
        queue: queueShape,
        loadBranchQueue: PropTypes.func,
    };

    static defaultProps = {
        queue: null,
        loadBranchQueue: noop,
    };

    componentDidMount() {
        const { queue, loadBranchQueue } = this.props;

        !queue && loadBranchQueue();
    }

    render() {
        const { queue, owner, repository, branch } = this.props;

        return (
            <div>
                <h1>{owner}/{repository}/{branch}</h1>
                {queue && <Queue owner={owner} repository={repository} queue={queue} />}
            </div>
        );
    }
}

export default BranchQueue;
