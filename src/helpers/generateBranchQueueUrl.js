import { API_BASE_URL } from '../constants/config';
import join from 'ramda/src/join';

export default (owner, repository, branch) =>
    join('/', [
        API_BASE_URL,
        'queue',
        owner,
        repository,
        branch
    ]);
