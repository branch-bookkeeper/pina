import partial from 'ramda/src/partial';
import indexBy from 'ramda/src/indexBy';
import path from 'ramda/src/path';
import compose from 'ramda/src/compose';
import objOf from 'ramda/src/objOf';
import ifElse from 'ramda/src/ifElse';
import always from 'ramda/src/always';

import fetchUserInstallations from '../../helpers/fetchUserInstallations';
import { mergeEntities } from '../entities';
import { requestStart } from './requests';
import { requestIdEq } from './helpers';

// Actions
export const loadInstallations = accessToken => requestStart(
    'installations',
    partial(fetchUserInstallations, [accessToken]),
);

// Store functions
export const storeInstallations = ifElse(
    requestIdEq('installations'),
    compose(
        mergeEntities,
        compose(
            objOf('installations'),
            indexBy(path(['account', 'login'])),
            path(['payload', 'result'])
        ),
    ),
    always(undefined),
);
