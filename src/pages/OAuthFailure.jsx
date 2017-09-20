import qs from 'qs';
import React from 'react';
import { GITHUB_CLIENT_ID } from '../constants/config';

const OAuthFailure = ({ location: { search } }) => {
    const { error } = qs.parse(search.substr(1));

    return (
        <div>
            <h1>Branch Bookkeeper</h1>
            <p><strong>Login failed:</strong> {error}</p>
            <a href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`}>
                Click here to retry
            </a>
        </div>
    );
};

export default OAuthFailure;
