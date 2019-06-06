import {
    curry,
    fromPairs,
    map,
    adjust,
    toPairs,
} from 'ramda';

//    mapKeys :: (String -> String) -> Object -> Object
export default curry((fn, obj) => fromPairs(map(adjust(0, fn), toPairs(obj))));
