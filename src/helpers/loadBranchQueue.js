export default (accessToken, owner, repository, branch) => {
    const url = `https://cors-anywhere.herokuapp.com/https://branch-bookkeeper.herokuapp.com/api/${owner}/${repository}/${branch}`;
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(response => response.json());
}
