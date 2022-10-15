const {OAuth2Client} = require('google-auth-library');
var express = require('express');
var router = express.Router();
const OAuth2keys = require('./../oauth2.key.json');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/login');
});

/* Login page. */
router.get('/login', function(req, res, next) {
    const login_state = parseInt(req.cookies.login_state);

	if (login_state === 1)
        res.redirect('/user_info');
	else
    	res.render('login', { title: 'Google Login' });
});

/* Post google Login */
router.get('/google_login', async function(req, res, next) {
    const code = req.query.code;
    const login_state = parseInt(req.cookies.login_state);
    const oAuth2Client = new OAuth2Client(
        OAuth2keys.web.client_id,
        OAuth2keys.web.client_secret,
        OAuth2keys.web.redirect_uris[0]
    );

    if (login_state === 1) {
        res.redirect('/user_info');
    } else if (code !== undefined) {
        const getTokenRes = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(getTokenRes.tokens);
    
        const loginTicket = await oAuth2Client.verifyIdToken({
            idToken: oAuth2Client.credentials.id_token,
            audience: OAuth2keys.web.client_id,
        });
        // console.log(loginTicket);
		// loginTicket.payload.sub 可作為 google 登入 id 儲存在資料庫中

        const userInfo = loginTicket.payload;

        res.cookie('login_state', 1);
        res.cookie('user_info', {
            name: userInfo.name,
            email: userInfo.email,
            avatar: userInfo.picture
        });

        res.redirect('/user_info')
    } else {
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [ // 需在 OAuth 設定範圍
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ]
        });

        res.redirect(authorizeUrl);
    }
});

router.get('/logout', function(req, res, next) {
	res.clearCookie('login_state');
	res.clearCookie('user_info');
	res.redirect('/login');
});

/* User Info Page */
router.get('/user_info', function(req, res, next) {
    let login_state = parseInt(req.cookies.login_state);
    let user_info = req.cookies.user_info;

    console.log(typeof login_state);

    if (login_state !== 1) {
        res.redirect('/login');
        return;
    }

    if (user_info.name === undefined || user_info.email === undefined || user_info.avatar === undefined) {
        res.cookie('login_state', 0);
        res.redirect('/login');
        return;
    }

    res.render('user_info', { title: '登入者頁面', ...user_info });
});

module.exports = router;
