import generateBranchQueueUrl from './generateBranchQueueUrl';
import failWhenNotOk from './failWhenNotOk';

export default (accessToken, owner, repository, branch) => {
    const url = generateBranchQueueUrl(owner, repository, branch);
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(failWhenNotOk)
        .then(response => response.json());
}
