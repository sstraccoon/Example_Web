const jwt = require('jsonwebtoken');
const customclass = require('../error/customError');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();  
    } else {
        // res.render('layout', {message: 'login 필요'});
        // res.status(403).send(`alert(로그인 필요)`);
        throw new Error('로그인이 필요 합니다.')
        // res.redirect(`/?error=로그인이 필요 합니다.`);
    }
};

exports.isNotLoggendIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        // res.status(404).send({message: '이미 로그인한 상태입니다.'});
        throw new Error('이미 로그인한 상태입니다.')
        // res.redirect(`/?error=${message}`);
        
    }
};

exports.verifyToken = (req, res, next) => {
    try {
        // 요청 헤더에 저장된 토큰을 사용함 (req.headers.authorization) 사용자가 쿠키처럼 헤더에 토큰을 넣어 보낼 것.
        // jwt.verify 메서드로 토큰을 검증, 첫 번재 인수로 코튼을 두 번째 인수로 코튼의 비밀 키를 넣는다.
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') { // 유효 기간 초과
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.',
        });
    }
};

exports.catchError = (err, message, next) => {
    console.error(err);

    if (err instanceof customclass) {
        next(err);
    } else {
        throw new customclass(message);
    }
};