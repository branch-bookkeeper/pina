import { combineEpics } from 'redux-observable';

import { requestFetchEpic } from './requests';
import { storeUserEpic } from './user';
import { storeRepositoriesEpic } from './repositories';
import { storePullRequestEpic } from './pullRequests';
import { storeBranchQueueEpic } from './queues';

export default combineEpics(
    requestFetchEpic,
    storeUserEpic,
    storeRepositoriesEpic,
    storePullRequestEpic,
    storeBranchQueueEpic,
);
