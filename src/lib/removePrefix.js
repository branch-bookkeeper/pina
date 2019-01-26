import curry from 'ramda/src/curry';

export default curry((length, string) => string.substr(length));
