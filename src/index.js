import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Provider from 'react-redux/lib/components/Provider';
import { createStore } from 'redux';

import { default as rootReducer } from './redux';
import middlewares from './middlewares';

import AppContainer from './containers/AppContainer';

import './index.css';

const store = createStore(rootReducer, middlewares);

ReactDOM.render(
    <Provider store={store} >
        <BrowserRouter>
            <AppContainer />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
