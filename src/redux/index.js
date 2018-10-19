import { combineReducers } from 'redux';

import user from './user';
import requests, { stateShape as requestsShape } from './requests';
import * as entities from './entities';
import push, { stateShape as pushShape } from './push';
import ui, { stateShape as uiShape } from './ui';

const rootReducer = combineReducers({
    user,
    requests,
    entities: entities.default,
    push,
    ui,
});

export default rootReducer;

export const entitiesShape = entities.stateShape;
export {
    requestsShape,
    pushShape,
    uiShape,
};

// Selectors - entities
export const getRepositoryPullRequests = (owner, repository, state) =>
    entities.getRepositoryPullRequests(owner, repository, state.entities);
