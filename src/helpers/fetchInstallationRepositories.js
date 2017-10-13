import prop from 'ramda/src/prop';
import curry from 'ramda/src/curry';
import compose from 'ramda/src/compose';
import all from 'ramda/src/all';
import filter from 'ramda/src/filter';
import generateGithubApiUrl from './generateGithubApiUrl';
import pickValues from './pickValues';

// isAccessible :: repositoryShape -> bool
const isAccessible = compose(
    all(Boolean),
    pickValues(['pull', 'push']),
    prop('permissions'),
);

export default curry((accessToken, installationId) => {
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
        .then(prop('repositories'))
        .then(filter(isAccessible));
});
