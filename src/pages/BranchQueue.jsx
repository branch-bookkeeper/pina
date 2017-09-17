import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Queue from '../components/Queue';

import { queueShape, repositoryShape } from '../constants/propTypes';
import noop from '../helpers/noop';

class BranchQueue extends PureComponent {
    static propTypes = {
        repository: repositoryShape.isRequired,
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
        const { queue, repository, branch } = this.props;

        return (
            <div>
                <Link to="/">&laquo; Home</Link>
                <h1>{repository.full_name}/{branch}</h1>
                {queue && <Queue repository={repository} queue={queue} />}
            </div>
        );
    }
}

export default BranchQueue;
