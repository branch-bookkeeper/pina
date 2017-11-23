import partial from 'ramda/src/partial';
import ifElse from 'ramda/src/ifElse';
import always from 'ramda/src/always';

import fetchUser from '../../helpers/fetchUser';
import { mergeEntities } from '../entities';
import { requestStart } from './requests';
import { requestIdEq } from './helpers';

// Actions
export const loadUser = accessToken => requestStart(
    'user',
    partial(fetchUser, [accessToken]),
);

// Store functions
export const storeUser = ifElse(
    requestIdEq('user'),
    ({ payload: { result: user } }) => mergeEntities({ users: { [user.login]: user } }),
    always(undefined),
);
