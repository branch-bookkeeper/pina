import PropTypes from 'prop-types';

import { REQUEST_START, REQUEST_SUCCESS, REQUEST_ERROR } from './requests';
import { createInProgress, createWithResult, createWithError, requestShape } from '../../helpers/request';

export const stateShape = PropTypes.objectOf(requestShape);

const initialState = {};

// Reducer
export default function reducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case REQUEST_START: {
            const { requestId } = payload;

            state = {
                ...state,
                [requestId]: createInProgress(),
            };

            break;
        }
        case REQUEST_SUCCESS: {
            const { requestId, result } = payload;

            state = {
                ...state,
                [requestId]: createWithResult(result),
            };

            break;
        }
        case REQUEST_ERROR: {
            const { requestId, error } = payload;

            state = {
                ...state,
                [requestId]: createWithError(error),
            };

            break;
        }
        default: {
            break;
        }
    }

    return state;
}
