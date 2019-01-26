import identity from 'ramda/src/identity';
import ifElse from 'ramda/src/ifElse';
import converge from 'ramda/src/converge';
import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';
import objOf from 'ramda/src/objOf';

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
