import curry from 'ramda/src/curry';
import compose from 'ramda/src/compose';
import pickBy from 'ramda/src/pickBy';

import mapKeys from './mapKeys';
import removePrefix from './removePrefix';

const keyHasPrefix = curry((prefix, value, key) => key.substr(0, prefix.length) === prefix);

export default prefix => compose(
    mapKeys(removePrefix(prefix.length + 1)),
    pickBy(keyHasPrefix(prefix))
);
