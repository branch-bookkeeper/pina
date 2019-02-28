import identity from 'ramda/src/identity';
import pickBy from 'ramda/src/pickBy';
import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';
import startsWith from 'ramda/src/startsWith';
import lensProp from 'ramda/src/lensProp';
import apply from 'ramda/src/apply';
import join from 'ramda/src/join';
import split from 'ramda/src/split';
import over from 'ramda/src/over';
import set from 'ramda/src/set';
import equals from 'ramda/src/equals';
import nthArg from 'ramda/src/nthArg';

import removePrefix from './removePrefix';
import pickValues from './pickValues';
import mapKeys from './mapKeys';

const requestIdHasPathPrefix = prefix => compose(
    startsWith(prefix),
    join('/'),
    prop('path'),
    explodeRequestId,
);

const requestIdHasDomain = domain => compose(
    equals(domain),
    prop('domain'),
    explodeRequestId,
);

const removePathPrefix = prefixLength => {
    const pathLens = lensProp('path');

    return compose(
        apply(buildRequestId),
        pickValues(['domain', 'action', 'path']),
        over(pathLens, compose(
            split('/'),
            removePrefix(prefixLength),
            join('/'),
        )),
        explodeRequestId,
    );
};

export const buildRequestId = (domain, action = null, path = []) =>
    [[domain, action].filter(identity).join('.')].concat(path).filter(identity).join('/');

export const explodeRequestId = requestId => {
    const [domainAdnAction, ...path] = requestId.split('/');
    const [domain, action] = domainAdnAction.split('.');

    return { domain, action, path };
}

const removeDomain = compose(
    apply(buildRequestId),
    pickValues(['domain', 'action', 'path']),
    set(lensProp('domain'), null),
    explodeRequestId,
);

export const filterRequestsByPathPrefix = pathPrefix => compose(
    mapKeys(removePathPrefix(pathPrefix.length + 1)),
    pickBy(compose(requestIdHasPathPrefix(pathPrefix), nthArg(1)))
);

export const filterRequestsByDomain = domain => compose(
    mapKeys(removeDomain),
    pickBy(compose(requestIdHasDomain(domain), nthArg(1)))
);
