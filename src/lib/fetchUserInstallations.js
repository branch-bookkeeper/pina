import prop from 'ramda/src/prop';
import fetchFollowingPagination from './fetchFollowingPagination';
import generateGithubApiUrl from './generateGithubApiUrl';

// responseReducer :: [installationShape] -> Response -> Promise([installationShape])
const responseReducer = (installations, response) => (
    response.json()
        .then(prop('installations'))
        .then(nextInstallations => [...installations, ...nextInstallations])
);

export default (accessToken) => {
    const url = generateGithubApiUrl(['user', 'installations'], {
        per_page: 100,
    });
    const headers = {
        accept: 'application/vnd.github.machine-man-preview+json',
        authorization: `token ${accessToken}`,
    };

    return fetchFollowingPagination(responseReducer, [], url, { headers });
}
