export default (accessToken) => {
    const url = `https://api.github.com/user`;
    const headers = {
        authorization: `token ${accessToken}`,
    };

    return fetch(url, { headers })
        .then(response => response.json());
}
