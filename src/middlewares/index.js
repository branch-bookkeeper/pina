import { applyMiddleware } from 'redux';

import createStorageMiddleware from './createStorageMiddleware';
import { storageFunctions } from '../redux/requests';

const devMiddlewares = process.env.NODE_ENV === 'development'
    ? [require('redux-logger').default]
    : [];

export const createMiddlewares = (others) => applyMiddleware(
    createStorageMiddleware(storageFunctions),
    ...others,
    ...devMiddlewares,
);
