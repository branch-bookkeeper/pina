import React, { Component } from 'react';

import { KEY_LOGIN_REDIRECT_URL } from '../constants/localStorageKeys';

import LoginScreen from '../components/LoginScreen';

class Login extends Component {
    state = {
        loading: false,
    };

    render() {
        const { location: { pathname, search, hash } } = this.props;
        const { loading } = this.state;

        localStorage.setItem(KEY_LOGIN_REDIRECT_URL, [pathname, search, hash].join(''));

        return (
            <LoginScreen
                onLogin={this.startLoading}
                loading={loading}
            />
        );
    }

    startLoading = () => this.setState({ loading: true });
}

export default Login;
