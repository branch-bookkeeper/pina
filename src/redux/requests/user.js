import partial from 'ramda/src/partial';

import fetchUser from '../../helpers/fetchUser';
import { mergeEntities } from '../entities';
import { requestStart, REQUEST_SUCCESS } from './requests';

// Actions
export const loadUser = accessToken => requestStart(
    'user',
    partial(fetchUser, [accessToken]),
);

// Epics
export const storeUserEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS)
        .filter(({ payload: { requestId } }) => requestId === 'user')
        .map(({ payload: { result: user } }) => mergeEntities({ users: { [user.login]: user } }));
