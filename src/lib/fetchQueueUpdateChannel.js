import generateBackendApiUrl from './generateBackendApiUrl';
import failWhenNotOk from './failWhenNotOk';

export default (accessToken, owner, repository, branch) => {
    const url = generateBackendApiUrl([
        'queue',
        owner,
        repository,
        branch,
        'update-channel'
    ]);
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(failWhenNotOk)
        .then(response => response.json());
}
