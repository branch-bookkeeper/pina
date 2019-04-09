import { applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import createStorageMiddleware from './createStorageMiddleware';
import { epics as requestsEpics } from '../redux/requests';
import { epics as pushEpics } from '../redux/push';
import { epics as authEpics } from '../redux/auth';
import { epics as googleAnalyticsEpics } from '../redux/googleAnalytics';
import { epics as rollbarEpics } from '../redux/rollbar';
import { epics as queueUpdateEpics } from '../redux/queueUpdate';
import { epics as locationEpics } from '../redux/location';
import { storageFunctions } from '../redux/requests';

const devMiddlewares = process.env.NODE_ENV === 'development'
    ? [require('redux-logger').default]
    : [];

export const createMiddlewares = ({ history }) => applyMiddleware(
    createStorageMiddleware(storageFunctions),
    createEpicMiddleware(
        combineEpics(
            requestsEpics,
            pushEpics,
            authEpics,
            googleAnalyticsEpics,
            rollbarEpics,
            queueUpdateEpics,
        ),
        {
            dependencies: {
                history,
            },
        },
    ),
    ...devMiddlewares,
);
