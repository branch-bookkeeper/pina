import React, { Component } from 'react';
import PropTypes from 'prop-types';
import partial from 'ramda/src/partial';
import { withStyles } from '@material-ui/core/styles';

import { Route, Switch } from 'react-router-dom';
import { GITHUB_ACCESS_TOKEN } from '../constants/localStorageKeys';
import { entitiesShape, requestsShape } from '../redux';
import noop from '../lib/noop';
import { filterRequestsByPathPrefix } from '../lib/requestId';
import filterKeysByPrefix from '../lib/filterKeysByPrefix';

import TopBarContainer from '../containers/TopBarContainer';
import PageFooter from '../components/PageFooter';
import SettingsDialogContainer from '../containers/SettingsDialogContainer';
import SnackbarContainer from '../containers/SnackbarContainer';
import HomeContainer from '../containers/HomeContainer';
import Login from './Login';
import OAuthSuccess from './OAuthSuccess';
import OAuthFailure from './OAuthFailure';
import Repository from './Repository';
import NotFound from './NotFound';

const renderPublicRoutes = () => {
    return (
        <Switch>
            <Route exact path="/oauth/success" component={OAuthSuccess} />
            <Route exact path="/oauth/failure" component={OAuthFailure} />
            <Route component={Login}/>
        </Switch>
    );
}

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    loadUser: PropTypes.func,
    loadRepository: PropTypes.func,
    loadRepositories: PropTypes.func,
    loadRepositoryPullRequests: PropTypes.func,
    loadBranchQueue: PropTypes.func,
    addToBranchQueue: PropTypes.func,
    deleteFromBranchQueue: PropTypes.func,
    startQueueUpdates: PropTypes.func,
    stopQueueUpdates: PropTypes.func,
    user: PropTypes.string,
    entities: entitiesShape,
    requests: requestsShape,
};

const defaultProps = {
    loadUser: noop,
    loadRepository: noop,
    loadRepositories: noop,
    loadRepositoryPullRequests: noop,
    loadBranchQueue: noop,
    addToBranchQueue: noop,
    deleteFromBranchQueue: noop,
    startQueueUpdates: noop,
    stopQueueUpdates: noop,
};

const styles = theme => ({
    pageWrapper: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    pageContent: {
        flex: 1,
    },
});

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accessToken: localStorage.getItem(GITHUB_ACCESS_TOKEN),
        };

        this._loadUser = this._loadUser.bind(this);
        this._loadRepository = this._loadRepository.bind(this);
        this._loadRepositories = this._loadRepositories.bind(this);
        this._renderHome = this._renderHome.bind(this);
        this._renderRepository = this._renderRepository.bind(this);
    }

    componentWillReceiveProps() {
        const nextToken = localStorage.getItem(GITHUB_ACCESS_TOKEN);

        this.setState(state => ({
            accessToken: nextToken,
        }));
    }

    render() {
        const { accessToken } = this.state;

        return accessToken ? this._renderPrivateRoutes() : renderPublicRoutes();
    }

    _renderPrivateRoutes() {
        const { loadUser, classes } = this.props;
        const { accessToken } = this.state;

        return (
            <div className={classes.pageWrapper}>
                <div className={classes.pageContent}>
                    <TopBarContainer loadUser={() => loadUser(accessToken)} />
                    <div>
                        <Switch>
                            <Route
                                path="/:owner/:repository"
                                render={this._renderRepository}
                            />
                            <Route
                                exact
                                path="/"
                                render={this._renderHome}
                            />
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                    <SettingsDialogContainer />
                    <SnackbarContainer />
                </div>
                <PageFooter />
            </div>
        );
    }

    _renderHome() {
        const { accessToken } = this.state;

        return (
            <HomeContainer accessToken={accessToken} />
        )
    }

    _renderRepository({ match: { params: { owner, repository: repoName }, url: baseUrl } }) {
        const repositoryId = `${owner}/${repoName}`;
        const {
            entities: { repositories, queues, pullRequests, users },
            requests: {
                [`repositories/${repositoryId}`]: repositoryRequest,
                ...requests
            },
            user,
            startQueueUpdates,
            stopQueueUpdates,
        } = this.props;
        const { accessToken } = this.state;
        const filterEntities = filterKeysByPrefix(repositoryId);
        const repository = repositories[repositoryId];
        const repositoryRequests = {
            repository: repositoryRequest,
            ...filterRequestsByPathPrefix(repositoryId)(requests),
        }
        const repositoryQueues = filterEntities(queues);
        const repositoryPullRequests = filterEntities(pullRequests);

        const onAddToBranchQueue = (branch, pullRequestNumber) =>
            this._addToBranchQueue(owner, repoName, branch, pullRequestNumber, user);
        const onRemoveFromBranchQueue = (branch, queueItem) =>
            this._deleteFromBranchQueue(owner, repoName, branch, queueItem);

        return (
            <Repository
                baseUrl={baseUrl}
                user={users[user]}
                repository={repository}
                branchQueues={repositoryQueues}
                pullRequests={repositoryPullRequests}
                requests={repositoryRequests}
                loadUser={this._loadUser}
                loadRepository={() => this._loadRepository(repositoryId)}
                loadBranchQueue={branch => this._loadBranchQueue(owner, repoName, branch)}
                loadPullRequests={() => this._loadRepositoryPullRequests(owner, repoName)}
                startQueueUpdates={partial(startQueueUpdates, [accessToken, owner, repoName])}
                stopQueueUpdates={partial(stopQueueUpdates, [accessToken, owner, repoName])}
                onAddToBranchQueue={onAddToBranchQueue}
                onRemoveFromBranchQueue={onRemoveFromBranchQueue}
            />
        )
    }

    _loadUser() {
        const { loadUser } = this.props;
        const { accessToken } = this.state;

        loadUser(accessToken);
    }

    _loadInstallations() {
        const { loadInstallations } = this.props;
        const { accessToken } = this.state;

        loadInstallations(accessToken);
    }

    _loadRepository(repository) {
        const { loadRepository } = this.props;
        const { accessToken } = this.state;

        loadRepository(accessToken, repository);
    }

    _loadRepositories() {
        const { loadRepositories } = this.props;
        const { accessToken } = this.state;

        loadRepositories(accessToken);
    }

    _loadRepositoryPullRequests(owner, repository) {
        const { loadRepositoryPullRequests } = this.props;
        const { accessToken } = this.state;

        loadRepositoryPullRequests(accessToken, owner, repository);
    }

    _loadBranchQueue(owner, repository, branch) {
        const { loadBranchQueue } = this.props;
        const { accessToken } = this.state;

        loadBranchQueue(accessToken, owner, repository, branch);
    }

    _deleteFromBranchQueue(owner, repository, branch, queueItem) {
        const { deleteFromBranchQueue } = this.props;
        const { accessToken } = this.state;

        deleteFromBranchQueue(accessToken, owner, repository, branch, queueItem);
    }

    _addToBranchQueue(owner, repository, branch, pullRequestNumber, username) {
        const { addToBranchQueue } = this.props;
        const { accessToken } = this.state;

        addToBranchQueue(accessToken, owner, repository, branch, pullRequestNumber, username);
    }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default withStyles(styles)(App);
