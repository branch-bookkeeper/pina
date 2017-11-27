import apply from 'ramda/src/apply';
import { applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import createStorageMiddleware from './createStorageMiddleware';
import { epics as requestsEpics } from '../redux/requests';
import { epics as pushEpics } from '../redux/push';
import { epics as authEpics } from '../redux/auth';
import { storageFunctions } from '../redux/requests';

const devMiddlewares = process.env.NODE_ENV === 'development'
    ? [require('redux-logger').default]
    : [];

export default apply(applyMiddleware, [
    createStorageMiddleware(storageFunctions),
    createEpicMiddleware(
        combineEpics(
            requestsEpics,
            pushEpics,
            authEpics,
        ),
    ),
    ...devMiddlewares,
]);
