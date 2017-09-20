import React from 'react';
import { KEY_LOGIN_REDIRECT_URL } from '../constants/localStorageKeys';
import { GITHUB_CLIENT_ID } from '../constants/config';

const Login = ({ location: { pathname, search, hash } }) => {
    localStorage.setItem(KEY_LOGIN_REDIRECT_URL, [pathname, search, hash].join(''));

    return (
        <div>
            <h1>Branch Bookkeeper</h1>
            <a href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`}>
                Login with GitHub
            </a>
        </div>
    );
};

export default Login;
