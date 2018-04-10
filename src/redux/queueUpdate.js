import objOf from 'ramda/src/objOf';
import compose from 'ramda/src/compose';
import any from 'ramda/src/any';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { fromPromise as observableFromPromise } from 'rxjs/observable/fromPromise';
import { empty as observableEmpty } from 'rxjs/observable/empty';
import { map as map$ } from 'rxjs/operators/map';
import { mergeMap as mergeMap$ } from 'rxjs/operators/mergeMap';
import { takeUntil as takeUntil$ } from 'rxjs/operators/takeUntil';
import { retry as retry$ } from 'rxjs/operators/retry';
import { catchError as catchError$ } from 'rxjs/operators/catchError';
import { ofType as ofType$ } from 'redux-observable';
import Pusher from 'pusher-js';

import { PUSHER_APP_KEY } from '../constants/config';
import { mergeEntities } from './entities';
import { loadRepositoryPullRequests } from './requests';
import { getRepositoryPullRequests } from '../redux';
import fetchQueueUpdateChannel from '../helpers/fetchQueueUpdateChannel';

// Constants
export const START_QUEUE_UPDATES = 'START_QUEUE_UPDATES';
export const STOP_QUEUE_UPDATES = 'STOP_QUEUE_UPDATES';

// Actions
export const startQueueUpdates = (accessToken, owner, repository, branch) => ({
    type: START_QUEUE_UPDATES,
    payload: {
        accessToken,
        owner,
        repository,
        branch,
    },
});

export const stopQueueUpdates = (accessToken, owner, repository, branch) => ({
    type: STOP_QUEUE_UPDATES,
    payload: {
        accessToken,
        owner,
        repository,
        branch,
    },
});

// Epics
const subscribeToQueueUpdates = (action$, { getState }) =>
    action$.pipe(
        ofType$(START_QUEUE_UPDATES),
        mergeMap$(({ payload }) =>
            observableOf(payload).pipe(
                mergeMap$(({ accessToken, owner, repository, branch }) => {
                    return observableFromPromise(fetchQueueUpdateChannel(accessToken, owner, repository, branch)).pipe(
                        map$(channel => ({ ...channel, queueId: `${owner}/${repository}/${branch}` })),
                        mergeMap$(({ id: channelId, queueId }) => Observable.create(obs => {
                            const socket = new Pusher(PUSHER_APP_KEY, {
                                encrypted: true
                            });
                            const channel = socket.subscribe(channelId);

                            socket.connection.bind('error', (error) => {
                                obs.error(error);
                            });

                            channel.bind('pusher:subscription_error', (status) => {
                                obs.error(status);
                            });

                            channel.bind('queue.update', (nextQueue) => {
                                obs.next({
                                    accessToken,
                                    owner,
                                    repository,
                                    branch,
                                    nextQueue,
                               });
                            });

                            return () => {
                                channel.unbind();
                                socket.disconnect();
                            };
                        })),
                        takeUntil$(action$.ofType(STOP_QUEUE_UPDATES)),
                    );
                }),
                retry$(5),
                catchError$((e) => {
                    window.Rollbar && window.Rollbar.error('Queue update subscription error', e);

                    // After 5 retries just abort execution.
                    return observableEmpty();
                })
            )
        ),
        mergeMap$(({ accessToken, owner, repository, branch, nextQueue }) => {
            const state = getState();
            const pullRequests = getRepositoryPullRequests(owner, repository, state);
            const shouldReloadPullRequests = any(queueItem => !pullRequests[queueItem.pullRequestNumber], nextQueue);

            return [
                mergeEntities({ queues: { [`${owner}/${repository}/${branch}`]: nextQueue } }),
                ...shouldReloadPullRequests ? [loadRepositoryPullRequests(accessToken, owner, repository)] : [],
            ];
        }),
    );

export const epics = subscribeToQueueUpdates;
