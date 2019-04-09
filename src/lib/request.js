import PropTypes from 'prop-types';

const STATUS_NOT_MADE = 'not_made';
const STATUS_IN_PROGRESS = 'in_progress';
const STATUS_SUCCESS = 'success';
const STATUS_ERROR = 'error';

export const requestShape = PropTypes.shape({
    status: PropTypes.oneOf([
        STATUS_NOT_MADE,
        STATUS_IN_PROGRESS,
        STATUS_SUCCESS,
        STATUS_ERROR,
    ]).isRequired,
    result: PropTypes.any,
    error: PropTypes.any,
});

export const createNotMade = () => ({
    status: STATUS_NOT_MADE,
    result: null,
    error: null,
});

export const createInProgress = () => ({
    status: STATUS_IN_PROGRESS,
    result: null,
    error: null,
});

export const createWithResult = result => ({
    status: STATUS_SUCCESS,
    result,
    error: null,
});

export const createWithError = error => ({
    status: STATUS_ERROR,
    result: null,
    error,
});

export const isNotMade = request =>
    !request
    || !request.status
    || request.status === STATUS_NOT_MADE;

export const isInProgress = request =>
    request
    && request.status === STATUS_IN_PROGRESS;

export const isMade = request =>
    request
    && (request.status === STATUS_SUCCESS || request.status === STATUS_ERROR);

export const isSuccessful = request =>
    request
    && request.status === STATUS_SUCCESS;

export const isErrored = request =>
    request
    && (request.status === STATUS_ERROR);
