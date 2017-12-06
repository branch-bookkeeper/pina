import qs from 'qs';
import React, { Component } from 'react';

import LoginScreen from '../components/LoginScreen';

class OAuthFailure extends Component {
    state = {
        loading: false,
    };

    render() {
        const { location: { search } } = this.props;
        const { loading } = this.state;
        const { error } = qs.parse(search.substr(1));

        return (
            <LoginScreen
                errorMessage={error}
                onLogin={this.startLoading}
                loading={loading}
            />
        );
    }

    startLoading = () => this.setState({ loading: true });
}

export default OAuthFailure;
