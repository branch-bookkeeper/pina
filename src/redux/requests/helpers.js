import prop from 'ramda/src/prop';
import propEq from 'ramda/src/propEq';
import compose from 'ramda/src/compose';

export const requestIdEq = requestId => compose(
    propEq('requestId', requestId),
    prop('payload'),
);
