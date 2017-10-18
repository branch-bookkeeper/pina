import { combineReducers } from 'redux';

import user from './user';
import requests, { stateShape as requestsShape } from './requests';
import entities, { stateShape as entitiesShape } from './entities';
import push, { stateShape as pushShape } from './push';

const rootReducer = combineReducers({
    user,
    requests,
    entities,
    push,
});

export default rootReducer;

export {
    requestsShape,
    entitiesShape,
    pushShape,
};
