import {
    defaultTo,
    converge,
    pair,
    partial,
    ifElse,
    compose,
    prop,
    nth,
    isNil,
} from 'ramda';
import parseLinkHeader from 'parse-link-header';

import allP from './allP';
import failWhenNotOk from './failWhenNotOk';

const parseResponseLinkHeader = response => defaultTo({}, parseLinkHeader(response.headers.get('Link')));

const fetchFollowingPagination = (iterator, initialValue, url, options) => {
    return fetch(url, options)
        .then(failWhenNotOk)
        .then(converge(pair, [
            parseResponseLinkHeader,
            partial(iterator, [initialValue]),
        ]))
        .then(allP)
        .then(ifElse(
            compose(isNil, prop('next'), nth(0)),
            nth(1),
            ([links, nextValue]) => fetchFollowingPagination(iterator, nextValue, links.next.url, options),
        ));
};

export default fetchFollowingPagination;
