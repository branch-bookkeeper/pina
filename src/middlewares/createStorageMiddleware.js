import compose from 'ramda/src/compose';
import filter from 'ramda/src/filter';
import flatten from 'ramda/src/flatten';
import complement from 'ramda/src/complement';
import map from 'ramda/src/map';
import isNil from 'ramda/src/isNil';
import applyTo from 'ramda/src/applyTo';

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
