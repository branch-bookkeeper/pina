import curry from 'ramda/src/curry';
import fromPairs from 'ramda/src/fromPairs';
import map from 'ramda/src/map';
import adjust from 'ramda/src/adjust';
import toPairs from 'ramda/src/toPairs';

//    mapKeys :: (String -> String) -> Object -> Object
export default curry((fn, obj) => fromPairs(map(adjust(fn, 0), toPairs(obj))));
