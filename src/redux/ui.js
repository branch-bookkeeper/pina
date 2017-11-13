import T from 'ramda/src/T';
import F from 'ramda/src/F';
import always from 'ramda/src/always';
import evolve from 'ramda/src/evolve';
import PropTypes from 'prop-types';

// Constants
export const OPEN_SETTINGS_DIALOG = 'OPEN_SETTINGS_DIALOG';
export const CLOSE_SETTINGS_DIALOG = 'CLOSE_SETTINGS_DIALOG';
export const SHOW_SNACKBAR = 'SHOW_SNACKBAR';
export const HIDE_SNACKBAR = 'HIDE_SNACKBAR';

export const stateShape = PropTypes.shape({
    settingsDialog: PropTypes.shape({
        show: PropTypes.bool.isRequired,
    }).isRequired,
    snackbar: PropTypes.shape({
        show: PropTypes.bool.isRequired,
        message: PropTypes.string,
        actionDescription: PropTypes.string,
        action: PropTypes.shape({
            type: PropTypes.string.isRequired,
            payload: PropTypes.object,
        }),
    }),
});

const initialState = {
    settingsDialog: {
        show: false,
    },
    snackbar: {
        show: false,
        message: null,
        actionDescription: null,
        action: null,
    },
};

// Reducer
export default (state = initialState, action) => {
    const { type, payload } = action;

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
        case SHOW_SNACKBAR: {
            const { message, actionDescription, action } = payload;
            state = {
                ...state,
                snackbar: {
                    show: true,
                    message,
                    actionDescription,
                    action,
                },
            };
            break;
        }
        case HIDE_SNACKBAR:
            state = evolve({
                snackbar: {
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

export const showSnackbar = (message, actionDescription = null, action = null) => ({
    type: SHOW_SNACKBAR,
    payload: {
        message,
        actionDescription,
        action,
    },
});

export const hideSnackbar = always({
    type: HIDE_SNACKBAR,
});
