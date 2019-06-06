import {
    partial,
    indexBy,
    prop,
    path,
    compose,
    objOf,
    ifElse,
    always,
    is,
    identity,
    of,
} from 'ramda';

import fetchRepositories from '../../lib/fetchRepositories';
import fetchRepository from '../../lib/fetchRepository';
import { mergeEntities } from '../entities';
import { requestStart } from './requests';
import { requestIdStartsWith } from './helpers';

// Actions
export const loadRepositories = accessToken => requestStart(
    'repositories',
    partial(fetchRepositories, [accessToken]),
);

export const loadRepository = (accessToken, repository) => requestStart(
    `repositories/${repository}`,
    partial(fetchRepository, [accessToken, repository]),
);

// Store functions
export const storeRepositories = ifElse(
    requestIdStartsWith('repositories'),
    compose(
        mergeEntities,
        compose(
            objOf('repositories'),
            indexBy(prop('full_name')),
            ifElse(is(Array), identity, of),
            path(['payload', 'result'])
        ),
    ),
    always(undefined),
);
