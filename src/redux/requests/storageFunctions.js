import { storeUser } from './user';
import { storeInstallations } from './installations';
import { storeInstallationRepositories } from './repositories';
import { storeBranchQueue } from './queues';
import { storePullRequest, storeRepositoryPullRequests } from './pullRequests';

export default [
    storeUser,
    storeInstallations,
    storeInstallationRepositories,
    storeBranchQueue,
    storePullRequest,
    storeRepositoryPullRequests,
];
