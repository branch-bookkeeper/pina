import { combineEpics } from 'redux-observable';

import { requestFetchEpic } from './requests';
import { storeUserEpic } from './user';
import { storeInstallationsEpic } from './installations';
import { storeInstallationRepositoriesEpic } from './repositories';
import { storePullRequestEpic } from './pullRequests';
import { storeBranchQueueEpic, refreshBranchQueueOnActionEpic } from './queues';

export default combineEpics(
    requestFetchEpic,
    storeUserEpic,
    storeInstallationsEpic,
    storeInstallationRepositoriesEpic,
    storePullRequestEpic,
    storeBranchQueueEpic,
    refreshBranchQueueOnActionEpic,
);
