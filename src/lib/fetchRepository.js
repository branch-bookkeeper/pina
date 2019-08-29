import {
    curry,
    split,
    indexBy,
    path,
    prop,
 } from 'ramda';

import fetchUserInstallations from './fetchUserInstallations';
import fetchInstallationRepositories from './fetchInstallationRepositories';

export default curry((accessToken, repository) => {
    const [installationName] = split('/', repository);

    return fetchUserInstallations(accessToken)
        .then((installations) => {
            const byName = indexBy(path(['account', 'login']), installations);
            if (!byName[installationName]) {
                throw new Error('Not Found');
            }

            return fetchInstallationRepositories(accessToken, byName[installationName].id);
        })
        .then(repositories => {
            const byName = indexBy(prop(['full_name']), repositories);
            if (!byName[repository]) {
                throw new Error('Not Found');
            }

            return byName[repository];
        });
});
