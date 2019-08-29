import {
    compose,
    filter,
    flatten,
    complement,
    map,
    isNil,
    applyTo,
} from 'ramda';

import { REQUEST_SUCCESS } from "../redux/requests";

export default storageFunctions => ({ dispatch }) => next => action => {
    if (action.type === REQUEST_SUCCESS) {
        compose(
            map(dispatch),
            filter(complement(isNil)),
            flatten,
            map(applyTo(action)),
        )(storageFunctions);
    }

    next(action);
};
