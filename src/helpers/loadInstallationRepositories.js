import prop from 'ramda/src/prop';
import generateGithubApiUrl from './generateGithubApiUrl';

export default (accessToken, installationId) => {
    const url = generateGithubApiUrl([
        'user',
        'installations',
        installationId,
        'repositories',
    ]);
    const headers = {
        accept: 'application/vnd.github.machine-man-preview+json',
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(response => response.json())
        .then(prop('repositories'));
}
