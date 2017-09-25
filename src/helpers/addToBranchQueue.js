import generateBranchQueueUrl from './generateBranchQueueUrl';

export default (accessToken, owner, repository, branch, pullRequestNumber, username) => {
    const url = generateBranchQueueUrl(owner, repository, branch);
    const headers = {
        authorization: `token ${accessToken}`,
        'content-type': 'application/json',
    };

    const payload = {
        username,
        pullRequestNumber: parseInt(pullRequestNumber, 10),
        createdAt: (new Date()).toISOString(),
    };

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers
    });
};
