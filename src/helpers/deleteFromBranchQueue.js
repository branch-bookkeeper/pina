import generateBranchQueueUrl from './generateBranchQueueUrl';

export default (accessToken, owner, repository, branch, queueItem) => {
    const url = generateBranchQueueUrl(owner, repository, branch);
    const headers = {
        authorization: `token ${accessToken}`,
        'content-type': 'application/json',
    };

    return fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(queueItem),
        headers
    }).then(response => response.json());
};
