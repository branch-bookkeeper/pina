import identity from 'ramda/src/identity';
import always from 'ramda/src/always';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import propEq from 'ramda/src/propEq';
import { map as rxMap } from 'rxjs/operators/map';
import { filter as rxFilter } from 'rxjs/operators/filter';
import { combineEpics } from 'redux-observable';

import { REQUEST_ERROR } from './requests';
import { default as executeLogout } from '../helpers/logout';

// Constants
export const LOGOUT = 'LOGOUT';

// Action creators
export const logout = always({ type: LOGOUT });

const logoutEpic = (action$, { getState }) =>
    action$.ofType(LOGOUT).forEach(executeLogout);

const clearCredentialsOnAccessDenied = action$ =>
    action$.ofType(REQUEST_ERROR).pipe(
        rxMap(path(['payload', 'error'])),
        rxMap(prop('response')),
        rxFilter(identity),
        rxFilter(propEq('status', 401)),
    ).forEach(executeLogout);

export const epics = combineEpics(
    logoutEpic,
    clearCredentialsOnAccessDenied,
);
