import { combineEpics } from 'redux-observable';

import { requestFetchEpic } from './requests';
import { storeUserEpic } from './user';
import { storeRepositoriesEpic } from './repositories';

export default combineEpics(
    requestFetchEpic,
    storeUserEpic,
    storeRepositoriesEpic,
);
