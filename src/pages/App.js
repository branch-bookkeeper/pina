import React, { Component } from 'react';
import PropTypes from 'prop-types';
import curry from 'ramda/src/curry';
import compose from 'ramda/src/compose';
import values from 'ramda/src/values';
import pickBy from 'ramda/src/pickBy';

import { Route, Switch } from 'react-router-dom';
import { GITHUB_ACCESS_TOKEN } from '../constants/localStorageKeys';
import { entitiesShape, requestsShape } from '../redux';
import noop from '../helpers/noop';
import mapKeys from '../helpers/mapKeys';
import { isMade, createWithError } from '../helpers/request';
import { filterRequestsByPathPrefix } from '../helpers/requestId';
import removePrefix from '../helpers/removePrefix';

import TopBarContainer from '../containers/TopBarContainer';
import Home from './Home';
import Login from './Login';
import OAuthSuccess from './OAuthSuccess';
import OAuthFailure from './OAuthFailure';
import Repository from './Repository';

const keyHasPrefix = curry((prefix, value, key) => key.substr(0, prefix.length) === prefix);
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
    loadRepositories: PropTypes.func,
    loadPullRequest: PropTypes.func,
    loadBranchQueue: PropTypes.func,
    addToBranchQueue: PropTypes.func,
    deleteFromBranchQueue: PropTypes.func,
    user: PropTypes.string,
    entities: entitiesShape,
    requests: requestsShape,
};

const defaultProps = {
    loadUser: noop,
    loadRepositories: noop,
    loadPullRequest: noop,
    loadBranchQueue: noop,
    addToBranchQueue: noop,
    deleteFromBranchQueue: noop,
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accessToken: localStorage.getItem(GITHUB_ACCESS_TOKEN),
        };

        this._loadUser = this._loadUser.bind(this);
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
        const { loadUser } = this.props;
        const { accessToken } = this.state;

        return (
            <div>
                <TopBarContainer loadUser={() => loadUser(accessToken)} />
                <div style={{ height: 20 }} />
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
            </div>
        );
    }

    _renderHome() {
        const { entities: { repositories }, requests: { repositories: repositoriesRequest } } = this.props;

        const userRepositories = isMade(repositoriesRequest)
            ? values(repositories)
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
            requests: { repositories: repositoriesRequest, ...requests },
            user,
        } = this.props;
        const repositoryId = `${owner}/${repoName}`;
        const filterEntities = filterKeysByPrefix(repositoryId);
        const repository = repositories[repositoryId];
        const repositoryRequest = isMade(repositoriesRequest) && !repository
            ? createWithError('Not Found')
            : repositoriesRequest;
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
        const { loadRepositories } = this.props;
        const { accessToken } = this.state;

        loadRepositories(accessToken);
    }

    _loadPullRequest(owner, repository, pullRequestNumber) {
        const { loadPullRequest } = this.props;
        const { accessToken } = this.state;

        loadPullRequest(accessToken, owner, repository, pullRequestNumber);
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

export default App;
