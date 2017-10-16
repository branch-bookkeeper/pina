import __ from 'ramda/src/__';
import merge from 'ramda/src/merge';
import map from 'ramda/src/map';
import evolve from 'ramda/src/evolve';
import PropTypes from 'prop-types';

import { userShape, repositoryShape, pullRequestShape, queueShape } from '../constants/propTypes';

// Constants
export const ENTITIES_MERGE = 'ENTITIES_MERGE';

export const stateShape = PropTypes.shape({
    users: PropTypes.objectOf(userShape).isRequired,
    repositories: PropTypes.objectOf(repositoryShape).isRequired,
    pullRequests: PropTypes.objectOf(pullRequestShape).isRequired,
    queues: PropTypes.objectOf(queueShape).isRequired,
});

const initialState = {
    users: {},
    repositories: {},
    pullRequests: {},
    queues: {},
};

// Reducer
export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case ENTITIES_MERGE: {
            const { entities: newEntities } = payload;

            const transformations = map(entities => merge(__, entities), newEntities);
            state = evolve(transformations, state);
            break;
        }
        default:
            break;
    }

    return state;
};

// Actions
export const mergeEntities = entities => ({
    type: ENTITIES_MERGE,
    payload: {
        entities,
    },
});
