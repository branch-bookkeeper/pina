import qs from 'qs';
import React from 'react';
import { Redirect } from 'react-router-dom';

const OAuthSuccess = ({ location: { search: queryString } }) => {
    if (queryString.length && queryString[0] === '?') {
        const query = qs.parse(queryString.substr(1));
        if (query.access_token) {
            localStorage.setItem('gh-token', query.access_token);
        }
    }

    return (
        <Redirect to="/"/>
    );
};

export default OAuthSuccess;
