import generateBackendApiUrl from './generateBackendApiUrl';
import failWhenNotOk from './failWhenNotOk';

export default (accessToken, owner, repository) => {
    const url = generateBackendApiUrl([
        'pull-request',
        owner,
        repository,
    ]);
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(failWhenNotOk)
        .then(response => response.json());
}
