import join from 'ramda/src/join';

export default (owner, repository, branch) =>
    join('/', [
        'https://cors-anywhere.herokuapp.com/https://branch-bookkeeper.herokuapp.com/api',
        owner,
        repository,
        branch
    ]);
