import { curry, map } from 'ramda';

export default curry((keys, source) => map(key => source[key], keys));
