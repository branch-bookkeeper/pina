import { REQUEST_SUCCESS } from './requests';

export const initialState = null;

// Reducer
export default function reducer(state = initialState, action) {
    const { type, payload } = action;

    if (type === REQUEST_SUCCESS && payload.requestId === 'user') {
        const { result: { login: userLogin } } = payload;

        state = userLogin;
    }

    return state;
}
