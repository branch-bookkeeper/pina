import always from 'ramda/src/always';

import { GITHUB_ACCESS_TOKEN } from '../constants/localStorageKeys';

// Constants
export const LOGOUT = 'LOGOUT';

// Action creators
export const logout = always({ type: LOGOUT });

const logoutEpic = (action$, { getState }) =>
    action$.ofType(LOGOUT).forEach(() => {
        localStorage.removeItem(GITHUB_ACCESS_TOKEN);
        window.location.reload();
    });

export const epics = logoutEpic;
