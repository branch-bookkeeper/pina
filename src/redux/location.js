import contains from 'ramda/src/contains';
import pluck from 'ramda/src/pluck';
import identity from 'ramda/src/identity';
import F from 'ramda/src/F';
import { combineEpics } from 'redux-observable';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';
import { tap } from 'rxjs/operators/tap';

import { isSuccessful } from '../lib/request';

// Constants
export const SET_LOCATION = 'SET_LOCATION';

// Action creators
export const setLocation = location => ({
    type: SET_LOCATION,
    payload: {
        location,
    },
});

// Epics
const pullRequestIsInQueue = (pullRequest, queue) =>
    contains(pullRequest.pullRequestNumber, pluck('pullRequestNumber', queue));

const redirectToBranchQueueEpic = (action$, { getState }, { history }) =>
    action$.pipe(
        map(() => history.location.pathname.match(/^\/([^/]+)\/([^/]+)\/([^/]+)\/(\d+)$/)),
        filter(identity),
        map((match) => {
            const [, owner, repo, branch, pullRequestNumber] = match;

            return {
                owner,
                repo,
                branch,
                pullRequestNumber,
            };
        }),
        filter(({ owner, repo, branch }) => {
            const {
                requests: {
                    [`pullRequests/${owner}/${repo}`]: pullRequestsRequest,
                    [`queue/${owner}/${repo}/${branch}`]: queueRequest,
                },
            } = getState();

            return isSuccessful(queueRequest) && isSuccessful(pullRequestsRequest);
        }),
        filter(({ owner, repo, branch, pullRequestNumber }) => {
            const {
                entities: {
                    queues: {
                        [`${owner}/${repo}/${branch}`]: queue,
                    },
                    pullRequests: {
                        [`${owner}/${repo}/${pullRequestNumber}`]: pullRequest,
                    },
                },
            } = getState();

            return !pullRequest
                || pullRequest.branch !== branch
                || pullRequestIsInQueue(pullRequest, queue);
        }),
        tap(({ owner, repo, branch }) => {
            history.replace(`/${owner}/${repo}/${branch}`);
        }),
        filter(F),
    );

export const epics = combineEpics(
    redirectToBranchQueueEpic,
);
