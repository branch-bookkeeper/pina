import curry from 'ramda/src/curry';
import map from 'ramda/src/map';

export default curry((keys, source) => map(key => source[key], keys));
