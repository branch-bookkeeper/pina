import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import Provider from 'react-redux/lib/components/Provider';
import { createStore } from 'redux';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue, red } from '@material-ui/core/colors';

import { bbOrange } from './constants/colors';
import { default as rootReducer } from './redux';
import { setLocation } from './redux/location';
import { createMiddlewares } from './middlewares';

import HistoryTracker from './components/HistoryTracker';
import AppContainer from './containers/AppContainer';

import './index.css';

const theme = createMuiTheme({
    palette: {
      primary: bbOrange,
      secondary: blue,
      error: red,
    },
    typography: {
        useNextVariants: true,
    },
});


const history = createBrowserHistory();
const store = createStore(rootReducer, createMiddlewares({ history }));
const dispatchSetLocation = location => store.dispatch(setLocation(location));

ReactDOM.render(
    <React.Fragment>
        <CssBaseline />
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <Router history={history}>
                    <HistoryTracker onChange={dispatchSetLocation}>
                        <AppContainer />
                    </HistoryTracker>
                </Router>
            </MuiThemeProvider>
        </Provider>
    </React.Fragment>,
    document.getElementById('root')
);
