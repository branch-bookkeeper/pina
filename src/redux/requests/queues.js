import {
    partial,
    prop,
    compose,
    converge,
    objOf,
    anyPass,
    path,
    apply,
    concat,
    of,
    unapply,
    identity,
    ifElse,
    always,
} from 'ramda';
import {
    filter,
    map,
} from 'rxjs/operators';

import fetchBranchQueue from '../../lib/fetchBranchQueue';
import { default as doAddToBranchQueue } from '../../lib/addToBranchQueue';
import { default as doDeleteFromBranchQueue } from '../../lib/deleteFromBranchQueue';
import pickValues from '../../lib/pickValues';
import removePrefix from '../../lib/removePrefix';
import { mergeEntities } from '../entities';
import { requestStart, requestReset, REQUEST_SUCCESS } from './requests';
import { requestIdStartsWith } from './helpers';

const QUEUE = 'queue/';
const QUEUE_ADD = 'queue.add/';
const QUEUE_DELETE = 'queue.delete/';

const arrayOf = unapply(identity);

// Actions
export const loadBranchQueue = (accessToken, owner, repository, branch) => requestStart(
    `${QUEUE}${owner}/${repository}/${branch}`,
    partial(fetchBranchQueue, [accessToken, owner, repository, branch]),
    { owner, repository, branch },
);

export const addToBranchQueue = (accessToken, owner, repository, branch, pullRequestNumber, username) => requestStart(
    `${QUEUE_ADD}${owner}/${repository}/${branch}`,
    partial(doAddToBranchQueue, [accessToken, owner, repository, branch, pullRequestNumber, username]),
    { accessToken, owner, repository, branch },
);

const resetAddToBranchQueueRequest = (owner, repository, branch) => requestReset(
    `${QUEUE_ADD}${owner}/${repository}/${branch}`,
);

export const deleteFromBranchQueue = (accessToken, owner, repository, branch, queueItem) => requestStart(
    `${QUEUE_DELETE}${owner}/${repository}/${branch}`,
    partial(doDeleteFromBranchQueue, [accessToken, owner, repository, branch, queueItem]),
    { accessToken, owner, repository, branch },
);

const resetDeleteToBranchQueueRequest = (owner, repository, branch) => requestReset(
    `${QUEUE_DELETE}${owner}/${repository}/${branch}`,
);

// Epics
export const refreshBranchQueueOnActionEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS).pipe(
        filter(anyPass([requestIdStartsWith(QUEUE_ADD), requestIdStartsWith(QUEUE_DELETE)])),
        map(
            ({ payload: { meta: { accessToken, owner, repository, branch } } }) =>
                loadBranchQueue(accessToken, owner, repository, branch)
        ),
    );

// Store functions
export const storeBranchQueue = ifElse(
    requestIdStartsWith(QUEUE),
    converge(concat, [
        compose(
            of,
            mergeEntities,
            objOf('queues'),
            converge(objOf, [
                compose(
                    removePrefix(QUEUE.length),
                    prop('requestId')
                ),
                prop('result'),
            ]),
            prop('payload'),
        ),
        compose(
            converge(arrayOf, [
                apply(resetAddToBranchQueueRequest),
                apply(resetDeleteToBranchQueueRequest),
            ]),
            pickValues(['owner', 'repository', 'branch']),
            path(['payload', 'meta']),
        ),
    ]),
    always(undefined),
);
