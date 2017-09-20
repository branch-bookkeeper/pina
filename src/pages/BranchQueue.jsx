import compose from 'ramda/src/compose';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { setPropTypes, defaultProps, pure } from 'recompose';

import Queue from '../components/Queue';

import { queueShape, repositoryShape } from '../constants/propTypes';
import noop from '../helpers/noop';
import withPreloading from '../hocs/withPreloading';

const propTypes = {
    repository: repositoryShape.isRequired,
    branch: PropTypes.string.isRequired,
    queue: queueShape.isRequired,
    loadBranchQueue: PropTypes.func,
};

const BranchQueue = ({ queue, repository, branch }) => (
    <div>
        <Link to="/">&laquo; Home</Link>
        <h1>{repository.full_name}/{branch}</h1>
        {queue && <Queue repository={repository} queue={queue} />}
    </div>
);

const isLoadingNeeded = ({ queue }) => !queue;

const load = ({ loadBranchQueue }) => loadBranchQueue();

export default compose(
    setPropTypes(propTypes),
    defaultProps({
        loadBranchQueue: noop,
    }),
    withPreloading(isLoadingNeeded, load),
    pure,
)(BranchQueue);
