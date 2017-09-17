import __ from 'ramda/src/__';
import indexBy from 'ramda/src/indexBy';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import evolve from 'ramda/src/evolve';
import merge from 'ramda/src/merge';
import always from 'ramda/src/always';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { GITHUB_ACCESS_TOKEN } from './constants/localStorageKeys';
import loadUser from './helpers/loadUser';
import loadPullRequests from './helpers/loadPullRequests';
import loadRepositories from './helpers/loadRepositories';
import loadBranchQueue from './helpers/loadBranchQueue';
import addToBranchQueue from './helpers/addToBranchQueue';
import deleteFromBranchQueue from './helpers/deleteFromBranchQueue';
import findPullRequestQueueItem from './helpers/findPullRequestQueueItem';
import { isMade, createInProgress, createWithResult } from './helpers/request';
import Home from './pages/Home';
import Login from './pages/Login';
import OAuthSuccess from './pages/OAuthSuccess';
import BranchQueue from './pages/BranchQueue';
import PullRequest from './pages/PullRequest';

const renderPublicRoutes = () => {
    return (
        <Switch>
            <Route exact path="/oauth/success" component={OAuthSuccess} />
            <Route component={Login}/>
        </Switch>
    );
}

// Keep this a subclass of Component, or the routing won't work.
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accessToken: localStorage.getItem(GITHUB_ACCESS_TOKEN),
            user: null,
            entities: {
                pullRequests: {},
                queues: {},
                users: {},
                repositories: {},
            },
            requests: {
                repositories: null,
            },
        };

        this._loadUser = this._loadUser.bind(this);
        this._loadRepositories = this._loadRepositories.bind(this);
        this._renderHome = this._renderHome.bind(this);
        this._renderBranchQueuePage = this._renderBranchQueuePage.bind(this);
        this._renderPullRequestPage = this._renderPullRequestPage.bind(this);
    }

    componentWillReceiveProps() {
        const nextToken = localStorage.getItem(GITHUB_ACCESS_TOKEN);

        this.setState({
            accessToken: nextToken,
        });
    }

    render() {
        const { accessToken } = this.state;

        return accessToken ? this._renderPrivateRoutes() : renderPublicRoutes();
    }

    _renderPrivateRoutes() {
        return (
            <Switch>
                <Route
                    exact
                    path="/:owner/:repository/:branch"
                    render={this._renderBranchQueuePage}
                />
                <Route
                    exact
                    path="/:owner/:repository/:branch/:pullRequest"
                    render={this._renderPullRequestPage}
                />
                <Route
                    exact
                    path="/"
                    render={this._renderHome}
                />
            </Switch>
        );
    }

    _renderHome() {
        const { entities: { repositories }, requests: { repositories: repositoriesRequest } } = this.state;

        const userRepositories = isMade(repositoriesRequest)
            ? map(repositoryId => repositories[repositoryId], repositoriesRequest.result)
            : null;

        return (
            <Home
                repositories={userRepositories}
                loadRepositories={this._loadRepositories}
            />
        )
    }

    _renderBranchQueuePage({ match: { params: { owner, repository, branch } } }) {
        const { entities: { queues } } = this.state;

        return (
            <BranchQueue
                owner={owner}
                repository={repository}
                branch={branch}
                queue={queues[`${owner}_${repository}_${branch}`]}
                loadBranchQueue={() => this._loadBranchQueue(owner, repository, branch)}
            />
        );
    }

    _renderPullRequestPage({ match: { params: { owner, repository, branch, pullRequest: pullRequestString } } }) {
        const { user, entities: { pullRequests, queues, users } } = this.state;
        const pullRequestNumber = parseInt(pullRequestString, 10);
        const queue = queues[`${owner}_${repository}_${branch}`];
        const queueItem = queue ? findPullRequestQueueItem(pullRequestNumber, queue) : null;

        return (
            <PullRequest
                user={users[user]}
                owner={owner}
                repository={repository}
                branch={branch}
                pullRequestNumber={pullRequestNumber}
                pullRequest={pullRequests[`${owner}_${repository}_${pullRequestNumber}`]}
                queue={queue}
                loadUser={this._loadUser}
                loadPullRequests={() => this._loadPullRequests(owner, repository)}
                loadBranchQueue={() => this._loadBranchQueue(owner, repository, branch)}
                onAddToQueue={() => this._addToBranchQueue(owner, repository, branch, pullRequestNumber, user)}
                onRemoveFromQueue={() => this._deleteFromBranchQueue(owner, repository, branch, queueItem)}
            />
        );
    }

    _loadUser() {
        const { accessToken } = this.state;

        loadUser(accessToken)
            .then(user => this.setState(evolve({
                user: always(user.login),
                entities: {
                    users: merge(__, { [user.login]: user }),
                },
            })));
    }

    _loadRepositories() {
        const { accessToken } = this.state;

        this.setState(evolve({
            requests: {
                repositories: always(createInProgress()),
            },
        }));

        return loadRepositories(accessToken)
            .then(newRepositories => this.setState(evolve({
                entities: {
                    repositories: merge(__, indexBy(prop('full_name'), newRepositories)),
                },
                requests: {
                    repositories: always(createWithResult(map(prop('full_name'), newRepositories))),
                },
            })));
    }

    _loadPullRequests(owner, repository) {
        const { accessToken } = this.state;

        loadPullRequests(accessToken, owner, repository)
            .then(newPullRequests => this.setState(evolve({
                entities: {
                    pullRequests: merge(__, indexBy(prop('id'), newPullRequests)),
                },
            })));
    }

    _loadBranchQueue(owner, repository, branch) {
        const { accessToken } = this.state;
        const queueId = `${owner}_${repository}_${branch}`;

        loadBranchQueue(accessToken, owner, repository, branch)
            .then(queue => this.setState(evolve({
                entities: {
                    queues: merge(__, { [queueId]: queue }),
                },
            })));
    }

    _deleteFromBranchQueue(owner, repository, branch, queueItem) {
        const { accessToken } = this.state;

        deleteFromBranchQueue(accessToken, owner, repository, branch, queueItem)
            .then(() => this._loadBranchQueue(owner, repository, branch));
    }

    _addToBranchQueue(owner, repository, branch, pullRequestNumber, username) {
        const { accessToken } = this.state;

        addToBranchQueue(accessToken, owner, repository, branch, pullRequestNumber, username)
            .then(() => this._loadBranchQueue(owner, repository, branch));
    }
}

export default App;
