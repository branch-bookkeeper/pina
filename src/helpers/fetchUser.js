import generateGithubApiUrl from './generateGithubApiUrl';
import failWhenNotOk from './failWhenNotOk';

export default (accessToken) => {
    const url = generateGithubApiUrl(['user']);
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(failWhenNotOk)
        .then(response => response.json());
}
