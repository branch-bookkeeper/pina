import partial from 'ramda/src/partial';
import prop from 'ramda/src/prop';
import compose from 'ramda/src/compose';
import converge from 'ramda/src/converge';
import objOf from 'ramda/src/objOf';
import anyPass from 'ramda/src/anyPass';
import path from 'ramda/src/path';
import curry from 'ramda/src/curry';
import map from 'ramda/src/map';
import apply from 'ramda/src/apply';
import concat from 'ramda/src/concat';
import of from 'ramda/src/of';
import unapply from 'ramda/src/unapply';
import identity from 'ramda/src/identity';

import fetchBranchQueue from '../../helpers/fetchBranchQueue';
import { default as doAddToBranchQueue } from '../../helpers/addToBranchQueue';
import { default as doDeleteFromBranchQueue } from '../../helpers/deleteFromBranchQueue';
import removePrefix from '../../helpers/removePrefix';
import { mergeEntities } from '../entities';
import { requestStart, requestReset, REQUEST_SUCCESS } from './requests';
import { requestIdStartsWith } from './helpers';

const QUEUE = 'queue/';
const QUEUE_ADD = 'queue.add/';
const QUEUE_DELETE = 'queue.delete/';

const pickValues = curry((keys, source) => map(key => source[key], keys));
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
export const storeBranchQueueEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS)
        .filter(requestIdStartsWith(QUEUE))
        .flatMap(converge(concat, [
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
        ]));

export const refreshBranchQueueOnActionEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS)
        .filter(anyPass([requestIdStartsWith(QUEUE_ADD), requestIdStartsWith(QUEUE_DELETE)]))
        .map(
            ({ payload: { meta: { accessToken, owner, repository, branch } } }) =>
                loadBranchQueue(accessToken, owner, repository, branch)
        );
