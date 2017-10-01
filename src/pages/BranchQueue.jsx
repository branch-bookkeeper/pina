import compose from 'ramda/src/compose';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { setPropTypes, defaultProps, pure } from 'recompose';
import { OpenInNew } from 'material-ui-icons';

import LoadingScreen from '../components/LoadingScreen';
import Queue from '../components/Queue';
import BranchName from '../components/BranchName';

import { queueShape, repositoryShape } from '../constants/propTypes';
import noop from '../helpers/noop';

const AlignedOpenInNew = () => <OpenInNew style={{ verticalAlign: 'middle' }} />;

const propTypes = {
    repository: repositoryShape.isRequired,
    branch: PropTypes.string.isRequired,
    queue: queueShape.isRequired,
    loadBranchQueue: PropTypes.func,
};

const BranchQueue = ({ queue, repository, branch, loadBranchQueue }) => (
    <LoadingScreen isLoadingNeeded={!queue} load={loadBranchQueue}>
        <div>
            <Link to="/">&laquo; Home</Link>
            <h1><BranchName branch={branch} /></h1>
            <h2>
                <a href={repository.html_url}>
                    {repository.full_name} <AlignedOpenInNew />
                </a>
            </h2>
            {queue && <Queue repository={repository} queue={queue} />}
        </div>
    </LoadingScreen>
);

export default compose(
    setPropTypes(propTypes),
    defaultProps({
        loadBranchQueue: noop,
    }),
    pure,
)(BranchQueue);
