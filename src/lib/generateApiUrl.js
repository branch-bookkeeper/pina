import qs from 'qs';
import {
    curry,
    isEmpty,
 } from 'ramda';

export default curry((apiBaseUrl, chunks, queryParams = {}) => {
    const url = [apiBaseUrl, ...chunks].join('/');
    const queryString = qs.stringify(queryParams);

    return isEmpty(queryString)
        ? url
        : `${url}?${queryString}`;
});
