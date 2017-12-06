// Constants
export const SET_LOCATION = 'SET_LOCATION';

// Action creators
export const setLocation = location => ({
    type: SET_LOCATION,
    payload: {
        location,
    },
});
