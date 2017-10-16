import partial from 'ramda/src/partial';
import indexBy from 'ramda/src/indexBy';
import prop from 'ramda/src/prop';
import path from 'ramda/src/path';
import compose from 'ramda/src/compose';
import objOf from 'ramda/src/objOf';

import fetchRepositories from '../../helpers/fetchRepositories';
import { mergeEntities } from '../entities';
import { requestStart, REQUEST_SUCCESS } from './requests';
import { requestIdEq } from './helpers';

// Actions
export const loadRepositories = accessToken => requestStart(
    'repositories',
    partial(fetchRepositories, [accessToken]),
);

// Epics
export const storeRepositoriesEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS)
        .filter(requestIdEq('repositories'))
        .map(compose(
            objOf('repositories'),
            indexBy(prop('full_name')),
            path(['payload', 'result'])
        ))
        .map(mergeEntities);
