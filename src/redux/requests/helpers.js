import prop from 'ramda/src/prop';
import propEq from 'ramda/src/propEq';
import compose from 'ramda/src/compose';
import startsWith from 'ramda/src/startsWith';
import path from 'ramda/src/path';

export const requestIdEq = requestId => compose(
    propEq('requestId', requestId),
    prop('payload'),
);

export const requestIdStartsWith = requestIdPrefix => compose(
    startsWith(requestIdPrefix),
    path(['payload', 'requestId']),
);
