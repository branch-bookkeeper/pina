import partial from 'ramda/src/partial';
import prop from 'ramda/src/prop';
import compose from 'ramda/src/compose';
import converge from 'ramda/src/converge';
import objOf from 'ramda/src/objOf';

import fetchBranchQueue from '../../helpers/fetchBranchQueue';
import removePrefix from '../../helpers/removePrefix';
import { mergeEntities } from '../entities';
import { requestStart, REQUEST_SUCCESS } from './requests';
import { requestIdStartsWith } from './helpers';

const PREFIX = 'queue/';

// Actions
export const loadBranchQueue = (accessToken, owner, repository, branch) => requestStart(
    `${PREFIX}${owner}/${repository}/${branch}`,
    partial(fetchBranchQueue, [accessToken, owner, repository, branch]),
);

// Epics
export const storeBranchQueueEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS)
        .filter(requestIdStartsWith(PREFIX))
        .map(compose(
            objOf('queues'),
            converge(objOf, [
                compose(
                    removePrefix(PREFIX.length),
                    prop('requestId')
                ),
                prop('result'),
            ]),
            prop('payload'),
        ))
        .map(mergeEntities);
