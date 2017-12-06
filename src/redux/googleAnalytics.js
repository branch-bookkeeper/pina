import { mergeMap as mergeMap$ } from 'rxjs/operators/mergeMap';
import { filter as filter$ } from 'rxjs/operators/filter';
import { combineEpics } from 'redux-observable';

import { GOOGLE_ANALYTICS_ID } from '../constants/config';
import installGoogleAnalytics from '../helpers/installGoogleAnalytics';

import { SET_LOCATION } from './location';
import { REQUEST_SUCCESS } from './requests';
import { requestIdEq } from './requests/helpers';

const trackPageView = (path, user = {}) => {
    const ga = window.ga || (() => {});

    ga('set', 'page', path);
    ga('send', 'pageview');
};

const init = (user) => {
    const ga = window.ga || (() => {});

    ga('create', GOOGLE_ANALYTICS_ID, 'auto', {
        userId: user.login,
        clientId: user.login,
    });
};

// Epics
const trackLocationEpic = (action$, { getState }) =>
    action$.ofType(SET_LOCATION).pipe(
        mergeMap$(({ payload: { location: { pathname } } }) => {
            const { user, entities: { users } } = getState();

            trackPageView(pathname, users[user]);

            return [];
        }),
    );

const setUserEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS).pipe(
        filter$(requestIdEq('user')),
        mergeMap$(({ payload: { result: user } }) => {
            init(user);
            trackPageView(window.location.pathname, user);

            return [];
        }),
    )

export const epics = combineEpics(
    setUserEpic,
    trackLocationEpic,
);

(true || process.env.NODE_ENV === 'production') && installGoogleAnalytics();
