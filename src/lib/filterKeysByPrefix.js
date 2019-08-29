import {
    curry,
    compose,
    pickBy,
 } from 'ramda';

import mapKeys from './mapKeys';
import removePrefix from './removePrefix';

const keyHasPrefix = curry((prefix, value, key) => key.substr(0, prefix.length) === prefix);

export default prefix => compose(
    mapKeys(removePrefix(prefix.length + 1)),
    pickBy(keyHasPrefix(prefix))
);
