import OAuth from 'oauth';
import qs from 'qs';

const OAuth2 = OAuth.OAuth2;  

const {
    FRONTEND_URL = 'http://localhost:5000',
    GITHUB_CLIENT_ID = 'Iv1.435916aff1ff1c91',
    GITHUB_CLIENT_SECRET = 'Iv1.435916aff1ff1c91'
} = process.env;

const getGitHubOAuthAccessToken = (clientId, clientSecret, code) => {
    const oauthClient = new OAuth2(
        clientId,
        clientSecret,
        'https://github.com/',
        'login/oauth/authorize',
        'login/oauth/access_token',
        null
    );

    return new Promise((resolve, reject) => oauthClient.getOAuthAccessToken(
      code,
      null,
      (e, accessToken, refreshToken, results) => {
          if (e) {
              reject(new Error(e.message));
          } else if (results.error) {
              reject(new Error(results.error_description));
          } else {
              resolve(accessToken);
          }
      })
    );
}

const redirect = (callback, url) => callback(null, { body: '', statusCode: 302, headers: { location: url } });

export const handler = (event, context, callback) => getGitHubOAuthAccessToken(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, event.queryStringParameters.code)
  .then(accessToken => redirect(callback, `${FRONTEND_URL}/oauth/success#${qs.stringify({ access_token: accessToken })}`))
  .catch(e => redirect(callback, `${FRONTEND_URL}/oauth/failure?${qs.stringify({ error: e.message })}`));
