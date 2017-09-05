import __ from 'ramda/src/__';
import indexBy from 'ramda/src/indexBy';
import prop from 'ramda/src/prop';
import evolve from 'ramda/src/evolve';
import merge from 'ramda/src/merge';
import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import loadPullRequests from './helpers/loadPullRequests';
import loadBranchQueue from './helpers/loadBranchQueue';
import Home from './pages/Home';
import Login from './pages/Login';
import OAuthSuccess from './pages/OAuthSuccess';
import PullRequest from './pages/PullRequest';

const renderPublicRoutes = () => {
    return (
        <Switch>
            <Route exact path="/oauth/success" component={OAuthSuccess} />
            <Route component={Login}/>
        </Switch>
    );
}

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            accessToken: localStorage.getItem('gh-token'),
            entities: {
                pullRequests: {},
                queues: {},
            },
        };
    }

    componentWillReceiveProps() {
        const nextToken = localStorage.getItem('gh-token');

        this.setState({
            accessToken: nextToken,
        });
    }

    render() {
        const { accessToken } = this.state;

        return accessToken ? this._renderPrivateRoutes() : renderPublicRoutes();
    }

    _renderPrivateRoutes() {
        const { entities: { pullRequests, queues } } = this.state;

        const PullRequestPage = ({ match: { params: { owner, repository, branch, pullRequest: pullRequestNumber } } }) => (
            <PullRequest
                owner={owner}
                repository={repository}
                branch={branch}
                pullRequestNumber={parseInt(pullRequestNumber, 10)}
                pullRequest={pullRequests[`${owner}_${repository}_${pullRequestNumber}`]}
                queue={queues[`${owner}_${repository}_${branch}`]}
                loadPullRequests={() => this._loadPullRequests(owner, repository)}
                loadBranchQueue={() => this._loadBranchQueue(owner, repository, branch)}
            />
        );

        return (
            <Switch>
                <Route exact path="/:owner/:repository/:branch/:pullRequest" component={PullRequestPage} />
                <Route component={Home} />
            </Switch>
        );
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
}

export default App;
