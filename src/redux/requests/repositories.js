import partial from 'ramda/src/partial';
import indexBy from 'ramda/src/indexBy';
import prop from 'ramda/src/prop';
import path from 'ramda/src/path';
import compose from 'ramda/src/compose';
import objOf from 'ramda/src/objOf';
import ifElse from 'ramda/src/ifElse';
import always from 'ramda/src/always';
import is from 'ramda/src/is';
import identity from 'ramda/src/identity';
import of from 'ramda/src/of';

import fetchRepositories from '../../helpers/fetchRepositories';
import fetchRepository from '../../helpers/fetchRepository';
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
