const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggendIn } = require('./middlewares');
const User = require('../models/user');
const { addUser, login, logOut } = require('../controllers/auth');

const router = express.Router();

router.get('/join', isNotLoggendIn, (req, res, next) => {
    res.render('join');
});

router.post('/join', isNotLoggendIn, async (req, res, next) => {
    const { email, password, nick } = req.body;
    console.log('join _ router _ start');
    const result = await addUser(email, password, nick);
    console.log('join _ router _ END');
    if (result == false) {
        res.status(404).send({ message: '계정 생성에 실패 했습니다.' });
    }
    res.status(200);
});

router.get('/login', isNotLoggendIn, (reql, res, next) => {
    res.render('login');
});

router.post('/login', isNotLoggendIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.status(402).send(info.message);
            // return res.redirect(`/loginError=${info.message}`); 교제 보고 했을 때는  이렇게 처리 했음, 하지만 asiox로 처리 할 거니 주석 처리 및 수정
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
        // if you're using express-flash
        // req.flash('success_msg', 'session terminated');
        res.redirect('/board');
      });
  });
  

module.exports = router;