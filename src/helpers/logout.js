import { GITHUB_ACCESS_TOKEN } from '../constants/localStorageKeys';

export default () => {
    localStorage.removeItem(GITHUB_ACCESS_TOKEN);
    window.location.reload();
};
