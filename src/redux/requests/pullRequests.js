import partial from 'ramda/src/partial';
import prop from 'ramda/src/prop';
import compose from 'ramda/src/compose';
import converge from 'ramda/src/converge';
import objOf from 'ramda/src/objOf';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';

import fetchPullRequest from '../../helpers/fetchPullRequest';
import removePrefix from '../../helpers/removePrefix';
import { mergeEntities } from '../entities';
import { requestStart, REQUEST_SUCCESS } from './requests';
import { requestIdStartsWith } from './helpers';

// Actions
export const loadPullRequest = (accessToken, owner, repository, pullRequestNumber) => requestStart(
    `pullRequest/${owner}/${repository}/${pullRequestNumber}`,
    partial(fetchPullRequest, [accessToken, owner, repository, pullRequestNumber]),
);

// Epics
export const storePullRequestEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS).pipe(
        filter(requestIdStartsWith('pullRequest/')),
        map(compose(
            objOf('pullRequests'),
            converge(objOf, [
                compose(
                    removePrefix(12),
                    prop('requestId')
                ),
                prop('result'),
            ]),
            prop('payload'),
        )),
        map(mergeEntities),
    );
