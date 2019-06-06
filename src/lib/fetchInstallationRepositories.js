import {
    prop,
    curry,
    compose,
    all,
    filter,
} from 'ramda';
import generateGithubApiUrl from './generateGithubApiUrl';
import pickValues from './pickValues';
import fetchFollowingPagination from './fetchFollowingPagination';

// isAccessible :: repositoryShape -> bool
const isAccessible = compose(
    all(Boolean),
    pickValues(['pull', 'push']),
    prop('permissions'),
);

// responseReducer :: [repositoryShape] -> Response -> Promise([repositoryShape])
const responseReducer = (repositories, response) => (
    response.json()
        .then(prop('repositories'))
        .then(filter(isAccessible))
        .then(nextRepositories => [...repositories, ...nextRepositories])
);

export default curry((accessToken, installationId) => {
    const url = generateGithubApiUrl([
        'user',
        'installations',
        installationId,
        'repositories',
    ], {
        per_page: 100,
    });
    const headers = {
        accept: 'application/vnd.github.machine-man-preview+json',
        authorization: `token ${accessToken}`,
    };

    return fetchFollowingPagination(responseReducer, [], url, { headers });
});
