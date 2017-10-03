import generateBackendApiUrl from './generateBackendApiUrl';

export default (owner, repository, branch) =>
    generateBackendApiUrl([
        'queue',
        owner,
        repository,
        branch,
    ]);
