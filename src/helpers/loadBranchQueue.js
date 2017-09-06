import generateBranchQueueUrl from './generateBranchQueueUrl';

export default (accessToken, owner, repository, branch) => {
    const url = generateBranchQueueUrl(owner, repository, branch);
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(response => response.json());
}
