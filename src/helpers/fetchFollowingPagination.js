import defaultTo from 'ramda/src/defaultTo';
import converge from 'ramda/src/converge';
import pair from 'ramda/src/pair';
import partial from 'ramda/src/partial';
import ifElse from 'ramda/src/ifElse';
import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';
import nth from 'ramda/src/nth';
import isNil from 'ramda/src/isNil';
import parseLinkHeader from 'parse-link-header';

import allP from './allP';

const parseResponseLinkHeader = response => defaultTo({}, parseLinkHeader(response.headers.get('Link')));

const fetchFollowingPagination = (iterator, initialValue, url, options) => {
    return fetch(url, options)
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
