const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggendIn, catchError} = require('./middlewares');
const User = require('../models/user');
const { addUser, getUser, login, logOut } = require('../controllers/auth');
const controllerError = require('../error/controllerError');
const router = express.Router();

router.get('/join', isNotLoggendIn, (req, res, next) => {
    res.render('join');
});

router.post('/join', isNotLoggendIn, async (req, res, next) => {
    try {
        const { email, password, nick } = req.body;
        if (email === undefined || password === undefined || nick === undefined) {
            return res.status(500).send('필수 정보를 입력하세요');
        }
        const exUser = await getUser(email);
        if (exUser) {
            // throw new Error('이미 사용중인 email 입니다.');
            return res.status(404).send('이미 사용 중인 email 입니다.');
        }
        await addUser(email, password, nick);
        return res.status(200);
    } catch (err) {
        catchError(err, '회원 가입에 실패했습니다.', next);
    }
});

router.get('/login', isNotLoggendIn, (reql, res, next) => {
    res.render('login');
});

router.post('/login', isNotLoggendIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            catchError(authError, '로그인에 실패했습니다.', next);
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
        });
    })(req, res, next); //미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/board');
      });
  });
  

module.exports = router;