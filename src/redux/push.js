import compose from 'ramda/src/compose';
import path from 'ramda/src/path';
import { Observable } from 'rxjs';
import PropTypes from 'prop-types';
import { combineEpics } from 'redux-observable';

import { ONESIGNAL_APP_ID } from '../constants/config';
import { REQUEST_SUCCESS } from './requests';
import { requestIdEq } from './requests/helpers';

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
    action$.ofType(REQUEST_SUCCESS)
        .filter(requestIdEq('user'))
        .map(compose(
            pushNotificationsInit,
            path(['payload', 'result']),
        ));

const pushNotificationsInitEpic = (action$, { getState, dispatch }) =>
    action$.ofType(PUSH_NOTIFICATIONS_INIT)
        .forEach(({ payload: { user } }) => {
            const handleSubscriptionUpdate = compose(
                dispatch,
                pushNotificationsUpdateSubscription
            );

            OneSignal.push(() => {
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
    action$.ofType(PUSH_NOTIFICATIONS_SUBSCRIBE)
        .flatMap(action => {
            OneSignal.push(() => {
                OneSignal.registerForPushNotifications();
                OneSignal.setSubscription(true);
            });

            // Denied is never advertised explicitly, so we revert to unsubscribed after a timeout.
            return Observable
                .of(pushNotificationsUpdateSubscription(false))
                .delay(ASSUME_DENIED_TIMEOUT)
                .takeUntil(action$.ofType(PUSH_NOTIFICATIONS_UPDATE_SUBSCRIPTION));
        });

const pushNotificationsUnsubscribeEpic = action$ =>
    action$.ofType(PUSH_NOTIFICATIONS_UNSUBSCRIBE)
        .forEach(() => {
            OneSignal.push(() => {
                OneSignal.setSubscription(false);
            });
        });


export const epics = combineEpics(
    triggerPushNotificationsInitEpic,
    pushNotificationsInitEpic,
    pushNotificationsSubscribeEpic,
    pushNotificationsUnsubscribeEpic,
);
