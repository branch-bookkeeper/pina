import {
    identity,
    ifElse,
    converge,
    compose,
    prop,
    objOf,
} from 'ramda';

const doThrow = e => { throw e };

const createError = message => new Error(message);

const createErrorFromResponse = converge(Object.assign, [
    compose(createError, prop('statusText')),
    objOf('response'),
]);

export default ifElse(
    prop('ok'),
    identity,
    compose(doThrow, createErrorFromResponse),
);
