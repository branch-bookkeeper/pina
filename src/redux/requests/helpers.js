import {
    prop,
    propEq,
    compose,
    startsWith,
    path,
} from 'ramda';
export const requestIdEq = requestId => compose(
    propEq('requestId', requestId),
    prop('payload'),
);

export const requestIdStartsWith = requestIdPrefix => compose(
    startsWith(requestIdPrefix),
    path(['payload', 'requestId']),
);
