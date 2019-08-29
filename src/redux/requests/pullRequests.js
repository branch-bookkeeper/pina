import {
    partial,
    prop,
    compose,
    converge,
    objOf,
    indexBy,
    map,
    mergeRight,
    ifElse,
    always,
} from 'ramda';

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
            ({ result: pullRequests, meta: { owner, repository } }) => map(mergeRight({ owner, repository }), pullRequests),
            prop('payload'),
        ),
    ),
    always(undefined),
);
