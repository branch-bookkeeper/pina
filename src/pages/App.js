import React, { Component } from 'react';
import PropTypes from 'prop-types';
import __ from 'ramda/src/__';
import curry from 'ramda/src/curry';
import compose from 'ramda/src/compose';
import indexBy from 'ramda/src/indexBy';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import evolve from 'ramda/src/evolve';
import merge from 'ramda/src/merge';
import always from 'ramda/src/always';
import pickBy from 'ramda/src/pickBy';
import objOf from 'ramda/src/objOf';

import { Route, Switch } from 'react-router-dom';
import { GITHUB_ACCESS_TOKEN } from '../constants/localStorageKeys';
import { entitiesShape, requestsShape } from '../redux';
import noop from '../helpers/noop';
import mapKeys from '../helpers/mapKeys';
import loadPullRequest from '../helpers/loadPullRequest';
import loadRepositories from '../helpers/loadRepositories';
import loadBranchQueue from '../helpers/loadBranchQueue';
import addToBranchQueue from '../helpers/addToBranchQueue';
import deleteFromBranchQueue from '../helpers/deleteFromBranchQueue';
import { isMade, createInProgress, createWithResult, createWithError } from '../helpers/request';
import Home from './Home';
import Login from './Login';
import OAuthSuccess from './OAuthSuccess';
import OAuthFailure from './OAuthFailure';
import Repository from './Repository';

const keyHasPrefix = curry((prefix, value, key) => key.substr(0, prefix.length) === prefix);
const removePrefix = curry((length, string) => string.substr(length));
const filterKeysByPrefix = prefix => compose(
    mapKeys(removePrefix(prefix.length + 1)),
    pickBy(keyHasPrefix(prefix))
);

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
    loadUser: PropTypes.func,
    user: PropTypes.string,
    entities: entitiesShape,
    requests: requestsShape,
};

const defaultProps = {
    loadUser: noop,
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accessToken: localStorage.getItem(GITHUB_ACCESS_TOKEN),
            user: props.user,
            entities: {
                pullRequests: {},
                queues: {},
                users: props.entities.users,
                repositories: {},
            },
            requests: {
                ...props.requests,
                repositories: null,
                pullRequests: {},
            },
        };

        this._loadUser = this._loadUser.bind(this);
        this._loadRepositories = this._loadRepositories.bind(this);
        this._renderHome = this._renderHome.bind(this);
        this._renderRepository = this._renderRepository.bind(this);
    }

    componentWillReceiveProps({ user, entities, requests }) {
        const nextToken = localStorage.getItem(GITHUB_ACCESS_TOKEN);

        this.setState(state => ({
            user,
            accessToken: nextToken,
            entities: {
                ...state.entities,
                users: entities.users,
            },
            requests: {
                ...state.requests,
                ...requests,
            },
        }));
    }

    render() {
        const { accessToken } = this.state;

        return accessToken ? this._renderPrivateRoutes() : renderPublicRoutes();
    }

    _renderPrivateRoutes() {
        return (
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

    _renderRepository({ match: { params: { owner, repository: repoName }, url: baseUrl } }) {
        const {
            entities: { repositories, queues, pullRequests, users },
            requests: { repositories: repositoriesRequest, pullRequests: pullRequestsRequests },
            user,
        } = this.state;
        const repositoryId = `${owner}/${repoName}`;
        const filterEntities = filterKeysByPrefix(repositoryId);
        const repository = repositories[repositoryId];
        const repositoryRequest = isMade(repositoriesRequest) && !repository
            ? createWithError('Not Found')
            : repositoriesRequest;
        const repositoryPullRequestsRequests = filterEntities(pullRequestsRequests);
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
                repositoryRequest={repositoryRequest}
                branchQueues={repositoryQueues}
                pullRequests={repositoryPullRequests}
                pullRequestsRequests={repositoryPullRequestsRequests}
                loadUser={this._loadUser}
                loadRepository={this._loadRepositories}
                loadBranchQueue={branch => this._loadBranchQueue(owner, repoName, branch)}
                loadPullRequest={pullRequestNumber => this._loadPullRequest(owner, repoName, pullRequestNumber)}
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

    _loadPullRequest(owner, repository, pullRequestNumber) {
        const { accessToken } = this.state;
        const requestId = `${owner}/${repository}/${pullRequestNumber}`;

        this.setState(state => ({
            requests: {
                ...state.requests,
                pullRequests: {
                    [requestId]: createInProgress(),
                },
            },
        }));

        loadPullRequest(accessToken, owner, repository, pullRequestNumber)
            .then(newPullRequest => this.setState(evolve({
                entities: {
                    pullRequests: merge(__, objOf(requestId, newPullRequest) ),
                },
                requests: {
                    pullRequests: merge(__, objOf(requestId, createWithResult(prop('id', newPullRequest)))),
                },
            })))
            .catch(e => this.setState(evolve({
                requests: {
                    pullRequests: merge(__, objOf(requestId, createWithError(e))),
                },
            })));
    }

    _loadBranchQueue(owner, repository, branch) {
        const { accessToken } = this.state;
        const queueId = `${owner}/${repository}/${branch}`;

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

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
