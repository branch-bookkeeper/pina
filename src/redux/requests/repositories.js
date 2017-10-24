import partial from 'ramda/src/partial';
import indexBy from 'ramda/src/indexBy';
import prop from 'ramda/src/prop';
import path from 'ramda/src/path';
import compose from 'ramda/src/compose';
import objOf from 'ramda/src/objOf';

import fetchInstallationRepositories from '../../helpers/fetchInstallationRepositories';
import { mergeEntities } from '../entities';
import { requestStart, REQUEST_SUCCESS } from './requests';
import { requestIdStartsWith } from './helpers';

// Actions
export const loadInstallationRepositories = (accessToken, installationOwner, installationId) => requestStart(
    `repositories/${installationOwner}`,
    partial(fetchInstallationRepositories, [accessToken, installationId]),
);

// Epics
export const storeInstallationRepositoriesEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS)
        .filter(requestIdStartsWith('repositories/'))
        .map(compose(
            objOf('repositories'),
            indexBy(prop('full_name')),
            path(['payload', 'result'])
        ))
        .map(mergeEntities);
