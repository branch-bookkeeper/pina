import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { blue, red } from '@material-ui/core/colors';

import { bbOrange } from './constants/colors';
import { default as rootReducer, rootEpic } from './redux';
import { setLocation } from './redux/location';
import { createMiddlewares } from './middlewares';

import HistoryTracker from './components/HistoryTracker';
import AppContainer from './containers/AppContainer';

import './index.css';
import { createEpicMiddleware } from 'redux-observable';

const theme = createMuiTheme({
    palette: {
      primary: bbOrange,
      secondary: blue,
      error: red,
    },
});

console.log(theme);

const history = createBrowserHistory();
const epicMiddleware = createEpicMiddleware({
    dependencies: {
        history,
    },
});

const store = createStore(rootReducer, createMiddlewares([epicMiddleware]));
const dispatchSetLocation = location => store.dispatch(setLocation(location));

epicMiddleware.run(rootEpic);

ReactDOM.render(
    <React.Fragment>
        <CssBaseline />
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <HistoryTracker onChange={dispatchSetLocation}>
                        <AppContainer />
                    </HistoryTracker>
                </Router>
            </ThemeProvider>
        </Provider>
    </React.Fragment>,
    document.getElementById('root')
);
