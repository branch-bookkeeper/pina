import { combineReducers } from 'redux';

import user from './user';
import requests, { stateShape as requestsShape } from './requests';
import entities, { stateShape as entitiesShape } from './entities';

const rootReducer = combineReducers({
    user,
    requests,
    entities,
});

export default rootReducer;

export {
    requestsShape,
    entitiesShape,
};
