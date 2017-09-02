const router = require('express').Router();
const OAuth2 = require('oauth').OAuth2;
const qs = require('qs');
const { CLIENT_ID, CLIENT_SECRET } = process.env;

router.get('/callback', (req, res) => {
    const oauthClient = new OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        'https://github.com/',
        'login/oauth/authorize',
        'login/oauth/access_token',
        null);

    oauthClient.getOAuthAccessToken(
        req.query.code,
        null,
        function (e, accessToken, refreshToken, results) {
            var params = {};

            if (e) {
                params.error = e.message;
            } else if (results.error) {
                params.error = results.error_description;
            } else {
                params.access_token = accessToken;
            }

            if (params.error) {
                res.redirect(`/oauth/failure?${qs.stringify(params)}`)
            } else {
                res.redirect(`/oauth/success?${qs.stringify(params)}`)
            }
        });
});

router.get('/success', (req, res, next) => next());
router.get('/failure', (req, res, next) => next());

module.exports = router;
