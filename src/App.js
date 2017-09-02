import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import OAuthSuccess from './pages/OAuthSuccess';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    render() {
        const token = localStorage.getItem('gh-token');

        if (token) {
            return (
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h2>Welcome to React</h2>
                    </div>
                    <p className="App-intro">
                        To get started, edit <code>src/App.js</code> and save to reload.
                    </p>
                </div>
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
