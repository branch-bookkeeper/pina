const API_BASE_URL = 'https://api.github.com';

export default chunks => [API_BASE_URL].concat(chunks).join('/');
