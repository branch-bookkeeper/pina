import 'typeface-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Provider from 'react-redux/lib/components/Provider';
import { createStore } from 'redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { blue, red } from 'material-ui/colors';

import { bbOrange } from './constants/colors';
import { default as rootReducer } from './redux';
import middlewares from './middlewares';

import AppContainer from './containers/AppContainer';

import './index.css';

const theme = createMuiTheme({
    palette: {
      primary: bbOrange,
      secondary: blue,
      error: red,
    },
});

const store = createStore(rootReducer, middlewares);

ReactDOM.render(
    <Provider store={store} >
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <AppContainer />
            </BrowserRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);
