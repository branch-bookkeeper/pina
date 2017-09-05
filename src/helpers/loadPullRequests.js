import map from 'lodash/fp/map';

export default (accessToken, owner, repository) => {
    const url = `https://api.github.com/repos/${owner}/${repository}/pulls`;
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(response => response.json())
        .then(map(pullRequest => ({
            ...pullRequest,
            id: `${owner}_${repository}_${pullRequest.number}`,
        })));
}
