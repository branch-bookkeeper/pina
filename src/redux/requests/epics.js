import { combineEpics } from 'redux-observable';

import { requestFetchEpic } from './requests';
import { refreshBranchQueueOnActionEpic } from './queues';

export default combineEpics(
    requestFetchEpic,
    refreshBranchQueueOnActionEpic,
);
