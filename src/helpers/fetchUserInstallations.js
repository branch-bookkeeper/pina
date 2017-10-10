import prop from 'ramda/src/prop';
import generateGithubApiUrl from './generateGithubApiUrl';

export default (accessToken) => {
    const url = generateGithubApiUrl(['user', 'installations']);
    const headers = {
        accept: 'application/vnd.github.machine-man-preview+json',
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(response => response.json())
        .then(prop('installations'));
}
