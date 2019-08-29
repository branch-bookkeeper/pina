import qs from 'qs';
import {
    defaultTo,
    compose,
    filter,
    head,
 } from 'ramda';
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
