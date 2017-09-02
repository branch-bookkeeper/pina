import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import OAuthSuccess from './pages/OAuthSuccess';

class App extends Component {
    render() {
        const token = localStorage.getItem('gh-token');

        if (token) {
            return (
                <Switch>
                    <Route component={Home} />
                </Switch>
            );
        } else {
            return (
                <Switch>
                    <Route exact path="/oauth/success" component={OAuthSuccess} />
                    <Route component={Login}/>
                </Switch>
            );
        }
    }
}

export default App;
