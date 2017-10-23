import { applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import { epics as requestsEpics } from '../redux/requests';
import { epics as pushEpics } from '../redux/push';

export default applyMiddleware(
    createEpicMiddleware(
        combineEpics(
            requestsEpics,
            pushEpics,
        ),
    ),
);
