import T from 'ramda/src/T';
import F from 'ramda/src/F';
import always from 'ramda/src/always';
import evolve from 'ramda/src/evolve';
import PropTypes from 'prop-types';

// Constants
export const OPEN_SETTINGS_DIALOG = 'OPEN_SETTINGS_DIALOG';
export const CLOSE_SETTINGS_DIALOG = 'CLOSE_SETTINGS_DIALOG';

export const stateShape = PropTypes.shape({
    settingsDialog: PropTypes.shape({
        show: PropTypes.bool.isRequired,
    }).isRequired,
});

const initialState = {
    settingsDialog: {
        show: false,
    },
};

// Reducer
export default (state = initialState, action) => {
    const { type } = action;

    switch (type) {
        case OPEN_SETTINGS_DIALOG:
            state = evolve({
                settingsDialog: {
                    show: T,
                },
            }, state);
            break;
        case CLOSE_SETTINGS_DIALOG:
            state = evolve({
                settingsDialog: {
                    show: F,
                },
            }, state);
            break;
        default:
            break;
    }

    return state;
};

// Actions
export const openSettingsDialog = always({
    type: OPEN_SETTINGS_DIALOG,
});

export const closeSettingsDialog = always({
    type: CLOSE_SETTINGS_DIALOG,
});
