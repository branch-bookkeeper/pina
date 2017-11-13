import qs from 'qs';
import defaultTo from 'ramda/src/defaultTo';
import compose from 'ramda/src/compose';
import filter from 'ramda/src/filter';
import head from 'ramda/src/head';
import React from 'react';
import { Redirect } from 'react-router-dom';

import { GITHUB_ACCESS_TOKEN, KEY_LOGIN_REDIRECT_URL } from '../constants/localStorageKeys';

const stripStartingChar = (char, str) => {
    if (str && str.length && str[0] === char) {
        return str.substr(1);
    } else {
        return str;
    }
}

const OAuthSuccess = ({ location }) => {
    const { search, hash } = location;
    const queryString = compose(
        head,
        filter(input => input && input.length),
    )([
        stripStartingChar('?', search),
        stripStartingChar('#', hash),
    ]);

    if (queryString.length) {
        const query = qs.parse(queryString);
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
