import compose from 'ramda/src/compose';
import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { setPropTypes, defaultProps, pure } from 'recompose';
import OpenInNew from 'material-ui-icons/OpenInNew';
import Grid from 'material-ui/Grid';

import Queue from '../components/Queue';
import BranchName from '../components/BranchName';

import { queueShape, repositoryShape, pullRequestShape } from '../constants/propTypes';
import { requestShape, isMade } from '../helpers/request';
import noop from '../helpers/noop';
import withPreloading from '../hocs/withPreloading';

const AlignedOpenInNew = () => <OpenInNew style={{ verticalAlign: 'middle' }} />;

const propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
    repository: repositoryShape.isRequired,
    branch: PropTypes.string.isRequired,
    queue: queueShape.isRequired,
    selectedPullRequest: pullRequestShape,
    pullRequests: PropTypes.objectOf(pullRequestShape).isRequired,
    pullRequestsRequest: requestShape,
    loadBranchQueue: PropTypes.func,
    loadPullRequests: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
    canRemoveFromBranchQueue: PropTypes.func,
    isRemovingFromBranchQueue: PropTypes.func,
};

const BranchQueue = ({
    history,
    queue,
    repository,
    branch,
    pullRequests,
    onRemoveFromBranchQueue,
    canRemoveFromBranchQueue,
    isRemovingFromBranchQueue,
}) => (
    <div>
        <Link to="/">&laquo; Home</Link>
        <h1><BranchName branch={branch} /></h1>
        <h2>
            <a href={repository.html_url}>
                {repository.full_name} <AlignedOpenInNew />
            </a>
        </h2>
        {queue &&
            <Grid container justify="center">
                <Grid item xs={12} sm={9} md={8} lg={6} xl={4}>
                    <Queue
                        repository={repository}
                        queue={queue}
                        pullRequests={pullRequests}
                        onDeleteItem={onRemoveFromBranchQueue}
                        canDeleteItem={canRemoveFromBranchQueue}
                        isDeletingItem={isRemovingFromBranchQueue}
                    />
                </Grid>
            </Grid>}
    </div>
);

const isLoadingNeeded = ({ queue, pullRequestsRequest }) => !queue || !isMade(pullRequestsRequest);

const load = ({ queue, loadBranchQueue, pullRequestsRequest, loadPullRequests }) => {
    !queue && loadBranchQueue();
    !isMade(pullRequestsRequest) && loadPullRequests();
};

export default compose(
    withPreloading(isLoadingNeeded, load),
    setPropTypes(propTypes),
    defaultProps({
        loadBranchQueue: noop,
    }),
    pure,
    withRouter,
)(BranchQueue);
