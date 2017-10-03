import qs from 'qs';
import curry from 'ramda/src/curry';
import isEmpty from 'ramda/src/isEmpty';

export default curry((apiBaseUrl, chunks, queryParams = {}) => {
    const url = [apiBaseUrl, ...chunks].join('/');
    const queryString = qs.stringify(queryParams);

    return isEmpty(queryString)
        ? url
        : `${url}?${queryString}`;
});
