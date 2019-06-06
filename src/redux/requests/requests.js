import {
    from as observableFrom,
    of as observableOf,
} from 'rxjs';
import {
    catchError,
    map,
    mergeMap,
} from 'rxjs/operators';
import curry from 'ramda/src/curry';
import compose from 'ramda/src/compose';

// Constants
export const REQUEST_START = 'REQUEST_START';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
export const REQUEST_ERROR = 'REQUEST_ERROR';
export const REQUEST_RESET = 'REQUEST_RESET';

// Actions
export const requestStart = (requestId, fetch, meta = {}) => ({
    type: REQUEST_START,
    payload: {
        requestId,
        fetch,
        meta,
    },
});

export const requestReset = requestId => ({
    type: REQUEST_RESET,
    payload: {
        requestId,
    },
});

const requestSuccess = curry((requestId, meta, result) => ({
    type: REQUEST_SUCCESS,
    payload: {
        requestId,
        meta,
        result,
    },
}));

const requestError = curry((requestId, meta, error) => ({
    type: REQUEST_ERROR,
    payload: {
        requestId,
        meta,
        error,
    },
}));

// Epics
export const requestFetchEpic = action$ => action$.ofType(REQUEST_START).pipe(
    mergeMap(({ payload: { requestId, fetch, meta } }) =>
        observableFrom(fetch()).pipe(
            map(requestSuccess(requestId, meta)),
            catchError(compose(observableOf, requestError(requestId, meta))),
        )
    )
);
