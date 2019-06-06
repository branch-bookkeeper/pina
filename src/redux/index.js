import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import user from './user';
import { epics as authEpics } from './auth';
import requests, { stateShape as requestsShape, epics as requestsEpics } from './requests';
import * as entities from './entities';
import push, { stateShape as pushShape, epics as pushEpics } from './push';
import ui, { stateShape as uiShape } from './ui';
import { epics as googleAnalyticsEpics } from './googleAnalytics';
import { epics as rollbarEpics } from './rollbar';
import { epics as queueUpdateEpics } from './queueUpdate';
import { epics as locationEpics } from './location';

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

export const rootEpic = combineEpics(
    requestsEpics,
    pushEpics,
    authEpics,
    googleAnalyticsEpics,
    rollbarEpics,
    queueUpdateEpics,
    locationEpics,
);
