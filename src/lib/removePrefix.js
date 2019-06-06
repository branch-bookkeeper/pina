import { curry } from 'ramda';

export default curry((length, string) => string.substr(length));
