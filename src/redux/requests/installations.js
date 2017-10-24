import partial from 'ramda/src/partial';
import indexBy from 'ramda/src/indexBy';
import path from 'ramda/src/path';
import compose from 'ramda/src/compose';
import objOf from 'ramda/src/objOf';

import fetchUserInstallations from '../../helpers/fetchUserInstallations';
import { mergeEntities } from '../entities';
import { requestStart, REQUEST_SUCCESS } from './requests';
import { requestIdEq } from './helpers';

// Actions
export const loadInstallations = accessToken => requestStart(
    'installations',
    partial(fetchUserInstallations, [accessToken]),
);

// Epics
export const storeInstallationsEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS)
        .filter(requestIdEq('installations'))
        .map(compose(
            objOf('installations'),
            indexBy(path(['account', 'login'])),
            path(['payload', 'result'])
        ))
        .map(mergeEntities);
