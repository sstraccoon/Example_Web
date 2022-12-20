const router = require('express').Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn, catchError } = require('../middlewares');
const User = require('../../models/user');
const { addUser } = require('../../controller/auth');
const controllerError = require('../../error/controllerError');


/** 로그인 페이지 */ 
router.get('/signin', isNotLoggedIn, (req, res, next) => {
    res.locals.subTopBanner = "sign";
    res.locals.path = {
        MEMBERSHIP : '/auth/signin',
        로그인 : '/auth/signin',
    };
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, async (req, res, next) => {
    //아이디 비번 체크.
    passport.authenticate("local", (authError, user, info) =>{
        if (authError){
            catchError(authError, "로그인에 실패했습니다.", next);
        }
        if (!user) {
            return res.status(402).send(info.message);
        }
        return req.login(user, (loginError) => {
            if (loginError) { 
                console.error(loginError);
                next(loginError);
            }
            return res.status(200).end();
        })
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res, next) => {
     req.logout(() => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
     });
});

module.exports = router;