import { storeUser } from './user';
import { storeRepositories } from './repositories';
import { storeBranchQueue } from './queues';
import { storePullRequest, storeRepositoryPullRequests } from './pullRequests';

export default [
    storeUser,
    storeRepositories,
    storeBranchQueue,
    storePullRequest,
    storeRepositoryPullRequests,
];
