import {
    contains,
    pluck,
    identity,
    F,
} from 'ramda';
import { combineEpics } from 'redux-observable';
import {
    map,
    filter,
    tap,
} from 'rxjs/operators';

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

const redirectToBranchQueueEpic = (action$, state$, { history }) =>
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
            } = state$.value;

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
            } = state$.value;

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
