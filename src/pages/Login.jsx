import React from 'react';
import { KEY_LOGIN_REDIRECT_URL } from '../constants/localStorageKeys';

const Login = ({ location: { pathname, search, hash } }) => {
    localStorage.setItem(KEY_LOGIN_REDIRECT_URL, [pathname, search, hash].join(''));

    return (
        <div>
            <a href="https://github.com/login/oauth/authorize?client_id=Iv1.ae8d32938d68d499">Login with GitHub</a>
        </div>
    );
};

export default Login;
