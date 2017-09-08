import qs from 'qs';
import defaultTo from 'ramda/src/defaultTo';
import React from 'react';
import { Redirect } from 'react-router-dom';

import { GITHUB_ACCESS_TOKEN, KEY_LOGIN_REDIRECT_URL } from '../constants/localStorageKeys';

const OAuthSuccess = ({ location: { search: queryString } }) => {
    if (queryString.length && queryString[0] === '?') {
        const query = qs.parse(queryString.substr(1));
        if (query.access_token) {
            localStorage.setItem(GITHUB_ACCESS_TOKEN, query.access_token);
        }
    }
    const redirectPath = defaultTo('/', localStorage.getItem(KEY_LOGIN_REDIRECT_URL));

    return (
        <Redirect to={redirectPath}/>
    );
};

export default OAuthSuccess;
