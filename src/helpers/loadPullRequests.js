import map from 'lodash/fp/map';
import generateGithubApiUrl from './generateGithubApiUrl';

export default (accessToken, owner, repository) => {
    const url = generateGithubApiUrl([
        'repos',
        owner,
        repository,
        'pulls',
    ]) + '?per_page=100';
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(response => response.json())
        .then(map(pullRequest => ({
            ...pullRequest,
            id: `${owner}/${repository}/${pullRequest.number}`,
        })));
}
