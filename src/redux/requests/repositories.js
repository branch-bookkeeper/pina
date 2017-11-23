import partial from 'ramda/src/partial';
import indexBy from 'ramda/src/indexBy';
import prop from 'ramda/src/prop';
import path from 'ramda/src/path';
import compose from 'ramda/src/compose';
import objOf from 'ramda/src/objOf';
import ifElse from 'ramda/src/ifElse';
import always from 'ramda/src/always';

import fetchInstallationRepositories from '../../helpers/fetchInstallationRepositories';
import { mergeEntities } from '../entities';
import { requestStart } from './requests';
import { requestIdStartsWith } from './helpers';

// Actions
export const loadInstallationRepositories = (accessToken, installationOwner, installationId) => requestStart(
    `repositories/${installationOwner}`,
    partial(fetchInstallationRepositories, [accessToken, installationId]),
);

// Store functions
export const storeInstallationRepositories = ifElse(
    requestIdStartsWith('repositories/'),
    compose(
        mergeEntities,
        compose(
            objOf('repositories'),
            indexBy(prop('full_name')),
            path(['payload', 'result'])
        ),
    ),
    always(undefined),
);
