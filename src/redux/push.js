import compose from 'ramda/src/compose';
import path from 'ramda/src/path';
import always from 'ramda/src/always';
import { of as observableOf } from 'rxjs/observable/of';
import { filter } from 'rxjs/operators/filter';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { map } from 'rxjs/operators/map';
import { delay } from 'rxjs/operators/delay';
import { takeUntil } from 'rxjs/operators/takeUntil';
import PropTypes from 'prop-types';
import { combineEpics } from 'redux-observable';

import { ONESIGNAL_APP_ID } from '../constants/config';
import { REQUEST_SUCCESS } from './requests';
import { showSnackbar, openSettingsDialog } from './ui';
import { requestIdEq, requestIdStartsWith } from './requests/helpers';

const { OneSignal } = window;

// Constants
export const PUSH_NOTIFICATIONS_INIT = 'PUSH_NOTIFICATIONS_INIT';
export const PUSH_NOTIFICATIONS_UPDATE_SUBSCRIPTION = 'PUSH_NOTIFICATIONS_UPDATE_SUBSCRIPTION';
export const PUSH_NOTIFICATIONS_SUBSCRIBE = 'PUSH_NOTIFICATIONS_SUBSCRIBE';
export const PUSH_NOTIFICATIONS_UNSUBSCRIBE = 'PUSH_NOTIFICATIONS_UNSUBSCRIBE';

const ASSUME_DENIED_TIMEOUT = 10000;

export const stateShape = PropTypes.shape({
    isInitialized: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    isSubscribing: PropTypes.bool.isRequired,
    isUnsubscribing: PropTypes.bool.isRequired,
});

const initialState = {
    isInitialized: false,
    isSubscribed: false,
    isSubscribing: false,
    isUnsubscribing: false,
};

// Reducer
export default function reducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case PUSH_NOTIFICATIONS_UPDATE_SUBSCRIPTION:
            state = {
                ...state,
                isInitialized: true,
                isSubscribing: false,
                isUnsubscribing: false,
                isSubscribed: payload.isSubscribed,
            };
            break;

        case PUSH_NOTIFICATIONS_SUBSCRIBE:
            state = {
                ...state,
                isSubscribing: true,
            };
            break;

        case PUSH_NOTIFICATIONS_UNSUBSCRIBE:
            state = {
                ...state,
                isUnsubscribing: true,
            };
            break;

        default:
            break;
    }

    return state;
}

// Actions
const pushNotificationsInit = user => ({
    type: PUSH_NOTIFICATIONS_INIT,
    payload: {
        user,
    },
});

const pushNotificationsUpdateSubscription = isSubscribed => ({
    type: PUSH_NOTIFICATIONS_UPDATE_SUBSCRIPTION,
    payload: {
        isSubscribed,
    },
});

export const pushNotificationsSubscribe = () => ({
    type: PUSH_NOTIFICATIONS_SUBSCRIBE,
});

export const pushNotificationsUnsubscribe = () => ({
    type: PUSH_NOTIFICATIONS_UNSUBSCRIBE,
});

// Epics
const triggerPushNotificationsInitEpic = action$ =>
    action$.ofType(REQUEST_SUCCESS).pipe(
        filter(requestIdEq('user')),
        map(compose(
            pushNotificationsInit,
            path(['payload', 'result']),
        )),
    );

const pushNotificationsInitEpic = (action$, { getState, dispatch }) =>
    action$.ofType(PUSH_NOTIFICATIONS_INIT)
        .forEach(({ payload: { user } }) => {
            const handleSubscriptionUpdate = compose(
                dispatch,
                pushNotificationsUpdateSubscription
            );

            OneSignal && OneSignal.push(() => {
                OneSignal.init({
                    appId: ONESIGNAL_APP_ID,
                    autoRegister: false,
                });
                OneSignal.on('subscriptionChange', handleSubscriptionUpdate);
                OneSignal.on('notificationPermissionChange', permissionChange => {
                    handleSubscriptionUpdate(permissionChange.to === 'granted');
                });

                OneSignal.getNotificationPermission(permission => handleSubscriptionUpdate(permission === 'granted'));
                OneSignal.isPushNotificationsEnabled(handleSubscriptionUpdate);
                OneSignal.sendTag('username', user.login);
            });
        });

const pushNotificationsSubscribeEpic = action$ =>
    action$.ofType(PUSH_NOTIFICATIONS_SUBSCRIBE).pipe(
        mergeMap(action => {
            OneSignal.push(() => {
                OneSignal.registerForPushNotifications();
                OneSignal.setSubscription(true);
            });

            // Denied is never advertised explicitly, so we revert to unsubscribed after a timeout.
            return observableOf(pushNotificationsUpdateSubscription(false)).pipe(
                delay(ASSUME_DENIED_TIMEOUT),
                takeUntil(action$.ofType(PUSH_NOTIFICATIONS_UPDATE_SUBSCRIPTION)),
            );
        })
    );

const pushNotificationsUnsubscribeEpic = action$ =>
    action$.ofType(PUSH_NOTIFICATIONS_UNSUBSCRIBE)
        .forEach(() => {
            OneSignal.push(() => {
                OneSignal.setSubscription(false);
            });
        });

const showSnackbarOnQueueAddSuccessEpic = (action$, { getState }) =>
    action$.ofType(REQUEST_SUCCESS).pipe(
        filter(requestIdStartsWith('queue.add/')),
        filter(() => {
            const { push: { isInitialized, isSubscribed } } = getState();

            return isInitialized && !isSubscribed;
        }),
        map(always(showSnackbar(
            'Want to be alerted when you can merge? Subscribe to push notifications in Settings',
            'Open Settings',
            openSettingsDialog(),
        ))),
    );

export const epics = combineEpics(
    triggerPushNotificationsInitEpic,
    pushNotificationsInitEpic,
    pushNotificationsSubscribeEpic,
    pushNotificationsUnsubscribeEpic,
    showSnackbarOnQueueAddSuccessEpic,
);
