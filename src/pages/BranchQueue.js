import classNames from 'classnames';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import contains from 'ramda/src/contains';
import ease from 'ease-component';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { setPropTypes, defaultProps, pure } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';

import BranchQueueHeader from '../components/BranchQueueHeader';
import PageContent from '../components/PageContent';
import Queue from '../components/Queue';
import QueueItemCard from '../components/QueueItemCard';

import { userShape, queueShape, repositoryShape, pullRequestShape } from '../constants/propTypes';
import { requestShape, isNotMade, isMade } from '../lib/request';
import scrollToComponent from '../lib/scrollToComponent';
import noop from '../lib/noop';
import withPreloading from '../hocs/withPreloading';

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
    startQueueUpdates: PropTypes.func,
    stopQueueUpdates: PropTypes.func,
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
    outOfQueueCardWrapperEmpty: {
        borderTop: 'none',
        marginTop: 0,
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

    componentDidMount() {
        this.props.startQueueUpdates();
    }

    componentWillUnmount() {
        this.props.stopQueueUpdates();
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
        const { showOutOfQueueCard } = this.state;

        return (
            <div>
                <BranchQueueHeader repository={repository} branch={branch} />
                {queue &&
                    <PageContent>
                        <Queue
                            user={user}
                            repository={repository}
                            queue={queue}
                            pullRequests={pullRequests}
                            onRemoveFromBranchQueue={onRemoveFromBranchQueue}
                            removeFromBranchQueueRequest={removeFromBranchQueueRequest}
                            showLinkToAddItems={!showOutOfQueueCard}
                        />
                    </PageContent>}
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
            queue,
            addToBranchQueueRequest,
            onAddToBranchQueue,
        } = this.props;
        const { showOutOfQueueCard, selectedPullRequest } = this.state;
        const bookingInProgress = !isNotMade(addToBranchQueueRequest);
        const wrapperClasses = classNames(classes.outOfQueueCardWrapper, {
            [classes.outOfQueueCardWrapperEmpty]: queue.length === 0,
        });

        return (
            <Collapse in={showOutOfQueueCard} unmountOnExit>
                <PageContent>
                    <div className={wrapperClasses}>
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
                                        variant="contained"
                                        disabled={bookingInProgress}
                                        onClick={() => onAddToBranchQueue(selectedPullRequest.pullRequestNumber)}
                                    >
                                        Add to queue
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        className={classes.cancelButton}
                                        disabled={bookingInProgress}
                                        onClick={() => history.push(`/${repository.full_name}/${branch}`)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </QueueItemCard>}
                    </div>
                </PageContent>
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
