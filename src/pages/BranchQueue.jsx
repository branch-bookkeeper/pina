import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import contains from 'ramda/src/contains';
import ease from 'ease-component';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { setPropTypes, defaultProps, pure } from 'recompose';
import { withStyles } from 'material-ui/styles';
import { grey } from 'material-ui/colors';
import OpenInNew from 'material-ui-icons/OpenInNew';
import Grid from 'material-ui/Grid';
import Collapse from 'material-ui/transitions/Collapse';
import Button from 'material-ui/Button';

import Queue from '../components/Queue';
import QueueItemCard from '../components/QueueItemCard';
import BranchName from '../components/BranchName';

import { userShape, queueShape, repositoryShape, pullRequestShape } from '../constants/propTypes';
import { requestShape, isNotMade, isMade } from '../helpers/request';
import scrollToComponent from '../helpers/scrollToComponent';
import noop from '../helpers/noop';
import withPreloading from '../hocs/withPreloading';

const AlignedOpenInNew = () => <OpenInNew style={{ verticalAlign: 'middle' }} />;

const propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }),
    theme: PropTypes.shape({
        transitions: PropTypes.shape({
            getAutoHeightDuration: PropTypes.func.isRequired,
        }).isRequired,
    }),
    repository: repositoryShape.isRequired,
    branch: PropTypes.string.isRequired,
    user: userShape,
    queue: queueShape.isRequired,
    selectedPullRequest: pullRequestShape,
    pullRequests: PropTypes.objectOf(pullRequestShape).isRequired,
    pullRequestsRequest: requestShape,
    loadBranchQueue: PropTypes.func,
    loadPullRequests: PropTypes.func,
    onAddToBranchQueue: PropTypes.func,
    onRemoveFromBranchQueue: PropTypes.func,
};

const styles = theme => ({
    outOfQueueCardWrapper: {
        borderTop: `dashed 2px ${grey[300]}`,
        marginTop: theme.spacing.unit * 4,
        paddingTop: theme.spacing.unit * 4,
        paddingBottom: theme.spacing.unit * 2,
    },
    pullRequestActions: {
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        textAlign: 'center',
    },
    cancelButton: {
        marginLeft: theme.spacing.unit,
    },
});

const pullRequestIsInQueue = (pullRequest, queue) => {
    return pullRequest && contains(pullRequest.pullRequestNumber, map(prop('pullRequestNumber'), queue));
};

const scrollToCard = (theme, card) => {
    scrollToComponent(card, {
        duration: theme.transitions.getAutoHeightDuration,
        ease: ease.outSine,
    });
};

class BranchQueue extends Component {
    constructor(props) {
        super(props);

        const { selectedPullRequest, user, queue } = props;
        this.state = {
            showOutOfQueueCard: selectedPullRequest
                && user
                && !pullRequestIsInQueue(selectedPullRequest, queue),
            selectedPullRequest,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const { showOutOfQueueCard: prevShowOutOfQueueCard } = prevState;
        const { showOutOfQueueCard } = this.state;
        const { queue, user, theme, repository, branch, selectedPullRequest, history } = this.props;

        !prevShowOutOfQueueCard
            && showOutOfQueueCard
            && this.outOfQueueCard
            && setTimeout(() => scrollToCard(theme, this.outOfQueueCard), theme.transitions.duration.standard);

        queue
            && user
            && selectedPullRequest
            && pullRequestIsInQueue(selectedPullRequest, queue)
            && history.replace(`/${repository.full_name}/${branch}`);
    }

    componentWillReceiveProps(nextProps) {
        const { selectedPullRequest: prevSelectedPullRequest } = this.state;
        const { selectedPullRequest, queue } = nextProps;

        if (!selectedPullRequest || pullRequestIsInQueue(selectedPullRequest, queue)) {
            this.setState({
                showOutOfQueueCard: false,
                selectedPullRequest:
                    pullRequestIsInQueue(prevSelectedPullRequest, queue) ? null : prevSelectedPullRequest,
            });
        } else {
            this.setState({
                showOutOfQueueCard: true,
                selectedPullRequest,
            });
        }
    }

    render() {
        const {
            user,
            queue,
            repository,
            branch,
            pullRequests,
            removeFromBranchQueueRequest,
            onRemoveFromBranchQueue,
        } = this.props;

        return (
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
                                user={user}
                                repository={repository}
                                queue={queue}
                                pullRequests={pullRequests}
                                onRemoveFromBranchQueue={onRemoveFromBranchQueue}
                                removeFromBranchQueueRequest={removeFromBranchQueueRequest}
                            />
                        </Grid>
                    </Grid>}
                {this.renderOutOfQueueCard()}
            </div>
        );
    }

    renderOutOfQueueCard() {
        const {
            classes,
            history,
            user,
            repository,
            branch,
            addToBranchQueueRequest,
            onAddToBranchQueue,
        } = this.props;
        const { showOutOfQueueCard, selectedPullRequest } = this.state;
        const bookingInProgress = !isNotMade(addToBranchQueueRequest);

        return (
            <Collapse in={showOutOfQueueCard} unmountOnExit>
                <Grid container justify="center">
                    <Grid item xs={12} sm={9} md={8} lg={6} xl={4}>
                        <div className={classes.outOfQueueCardWrapper}>
                            {selectedPullRequest &&
                                <QueueItemCard
                                    innerRef={this.setOutOfQueueCardRef}
                                    elevation={6}
                                    queueItem={{
                                        pullRequestNumber: selectedPullRequest.pullRequestNumber,
                                        username: user.login,
                                        createdAt: '',
                                    }}
                                    pullRequest={selectedPullRequest}
                                    showPullRequestLink={false}
                                    loading={bookingInProgress}
                                >
                                    <div className={classes.pullRequestActions}>
                                        <Button
                                            color="primary"
                                            raised
                                            disabled={bookingInProgress}
                                            onClick={() => onAddToBranchQueue(selectedPullRequest.pullRequestNumber)}
                                        >
                                            Add to queue
                                        </Button>
                                        <Button
                                            className={classes.cancelButton}
                                            disabled={bookingInProgress}
                                            onClick={() => history.push(`/${repository.full_name}/${branch}`)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </QueueItemCard>}
                        </div>
                    </Grid>
                </Grid>
            </Collapse>
        );
    }

    setOutOfQueueCardRef = (ref) => { this.outOfQueueCard = ref; };
}

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
    withStyles(styles, { withTheme: true }),
    withRouter,
)(BranchQueue);
