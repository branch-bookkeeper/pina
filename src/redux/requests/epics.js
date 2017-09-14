import { combineEpics } from 'redux-observable';

import { requestFetchEpic } from './requests';
import { storeUserEpic } from './user';

export default combineEpics(
    requestFetchEpic,
    storeUserEpic,
);
