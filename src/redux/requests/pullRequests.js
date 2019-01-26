import partial from 'ramda/src/partial';
import prop from 'ramda/src/prop';
import compose from 'ramda/src/compose';
import converge from 'ramda/src/converge';
import objOf from 'ramda/src/objOf';
import indexBy from 'ramda/src/indexBy';
import map from 'ramda/src/map';
import merge from 'ramda/src/merge';
import ifElse from 'ramda/src/ifElse';
import always from 'ramda/src/always';

import fetchPullRequest from '../../lib/fetchPullRequest';
import fetchRepositoryPullRequests from '../../lib/fetchRepositoryPullRequests';
import removePrefix from '../../lib/removePrefix';
import { mergeEntities } from '../entities';
import { requestStart } from './requests';
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

// Store functions
export const storePullRequest = ifElse(
    requestIdStartsWith('pullRequest/'),
    compose(
        mergeEntities,
        compose(
            objOf('pullRequests'),
            converge(objOf, [
                compose(
                    removePrefix(12),
                    prop('requestId')
                ),
                prop('result'),
            ]),
            prop('payload'),
        ),
    ),
    always(undefined)
);

export const storeRepositoryPullRequests = ifElse(
    requestIdStartsWith('pullRequests/'),
    compose(
        mergeEntities,
        compose(
            objOf('pullRequests'),
            indexBy(({ owner, repository, pullRequestNumber }) => `${owner}/${repository}/${pullRequestNumber}`),
            ({ result: pullRequests, meta: { owner, repository } }) => map(merge({ owner, repository }), pullRequests),
            prop('payload'),
        ),
    ),
    always(undefined),
);
