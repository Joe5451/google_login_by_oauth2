const {OAuth2Client} = require('google-auth-library');
var express = require('express');
var router = express.Router();
const OAuth2keys = require('./../oauth2.key.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Google Login' });
});

/* Post google Login */
router.get('/google_login', async function(req, res, next) {
    const oAuth2Client = new OAuth2Client(
        OAuth2keys.web.client_id,
        OAuth2keys.web.client_secret,
        OAuth2keys.web.redirect_uris[0]
    );

    const code = req.query.code;

    if (code !== undefined) {
        const getTokenRes = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(getTokenRes.tokens);
    
        const loginTicket = await oAuth2Client.verifyIdToken({
            idToken: oAuth2Client.credentials.id_token,
            audience: OAuth2keys.web.client_id,
        });

        console.log(loginTicket);

        res.send('ok');
    } else {
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ]
        });

        res.redirect(authorizeUrl);
    }
});

module.exports = router;
