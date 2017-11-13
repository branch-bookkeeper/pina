import partial from 'ramda/src/partial';
import prop from 'ramda/src/prop';
import compose from 'ramda/src/compose';
import converge from 'ramda/src/converge';
import objOf from 'ramda/src/objOf';
import indexBy from 'ramda/src/indexBy';
import map from 'ramda/src/map';
import merge from 'ramda/src/merge';
import { filter as filter$ } from 'rxjs/operators/filter';
import { map as map$ } from 'rxjs/operators/map';

import fetchPullRequest from '../../helpers/fetchPullRequest';
import fetchRepositoryPullRequests from '../../helpers/fetchRepositoryPullRequests';
import removePrefix from '../../helpers/removePrefix';
import { mergeEntities } from '../entities';
import { requestStart, REQUEST_SUCCESS } from './requests';
import { requestIdStartsWith } from './helpers';

// Actions
export const loadPullRequest = (accessToken, owner, repository, pullRequestNumber) => requestStart(
    `pullRequest/${owner}/${repository}/${pullRequestNumber}`,
    partial(fetchPullRequest, [accessToken, owner, repository, pullRequestNumber]),
);

export const loadRepositoryPullRequests = (accessToken, owner, repository) => requestStart(
    `pullRequests/${owner}/${repository}`,
    partial(fetchRepositoryPullRequests, [accessToken, owner, repository]),
    { owner, repository },
);

// Epics
export const storePullRequestEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS).pipe(
        filter$(requestIdStartsWith('pullRequest/')),
        map$(compose(
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
        map$(mergeEntities),
    );

export const storeRepositoryPullRequestsEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS).pipe(
        filter$(requestIdStartsWith('pullRequests/')),
        map$(compose(
            objOf('pullRequests'),
            indexBy(({ owner, repository, pullRequestNumber }) => `${owner}/${repository}/${pullRequestNumber}`),
            ({ result: pullRequests, meta: { owner, repository } }) => map(merge({ owner, repository }), pullRequests),
            prop('payload'),
        )),
        map$(mergeEntities),
    );
