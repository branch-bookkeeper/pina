import generateBackendApiUrl from './generateBackendApiUrl';
import failWhenNotOk from './failWhenNotOk';

export default (accessToken, owner, repository, pullRequestNumber) => {
    const url = generateBackendApiUrl([
        'pull-request',
        owner,
        repository,
        pullRequestNumber,
    ]);
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(failWhenNotOk)
        .then(response => response.json());
}
