import { applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import { epics as requestsEpics } from '../redux/requests';

export default applyMiddleware(
    createEpicMiddleware(
        requestsEpics,
    ),
);
