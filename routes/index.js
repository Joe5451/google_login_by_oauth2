const {OAuth2Client} = require('google-auth-library');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Google Login' });
});

/* Post google Login */
router.get('/google_login', function(req, res, next) {
    const oAuth2Client = new OAuth2Client(
        '413085947600-pqac57sjp2dn2oo95fko266m6dq1v7dc.apps.googleusercontent.com',
        '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',
        'http://localhost:3000/google_back'
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });

    res.redirect(authorizeUrl);
});

module.exports = router;
