import generateGithubApiUrl from './generateGithubApiUrl';

export default (accessToken) => {
    const url = generateGithubApiUrl(['user']);
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(response => response.json());
}
