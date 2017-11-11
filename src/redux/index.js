import { combineReducers } from 'redux';

import user from './user';
import requests, { stateShape as requestsShape } from './requests';
import entities, { stateShape as entitiesShape } from './entities';
import push, { stateShape as pushShape } from './push';
import ui, { stateShape as uiShape } from './ui';

const rootReducer = combineReducers({
    user,
    requests,
    entities,
    push,
    ui,
});

export default rootReducer;

export {
    requestsShape,
    entitiesShape,
    pushShape,
    uiShape,
};
