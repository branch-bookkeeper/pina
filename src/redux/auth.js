import {
    identity,
    always,
    path,
    prop,
    propEq,
} from 'ramda';
import { map as rxMap, filter as rxFilter } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';

import { REQUEST_ERROR } from './requests';
import { default as executeLogout } from '../lib/logout';

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
