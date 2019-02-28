import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Provider from 'react-redux/lib/components/Provider';
import { createStore } from 'redux';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue, red } from '@material-ui/core/colors';

import { bbOrange } from './constants/colors';
import { default as rootReducer } from './redux';
import { setLocation } from './redux/location';
import middlewares from './middlewares';

import HistoryTracker from './components/HistoryTracker';
import AppContainer from './containers/AppContainer';

import './index.css';

import { helloWorld } from './PureTest.purs';

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

const store = createStore(rootReducer, middlewares);
const dispatchSetLocation = location => store.dispatch(setLocation(location));

console.log(helloWorld('Hey!'));

ReactDOM.render(
    <React.Fragment>
        <CssBaseline />
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    <HistoryTracker onChange={dispatchSetLocation}>
                        <AppContainer />
                    </HistoryTracker>
                </BrowserRouter>
            </MuiThemeProvider>
        </Provider>
    </React.Fragment>,
    document.getElementById('root')
);
