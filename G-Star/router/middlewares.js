const jwt = require('jsonwebtoken');
const customclass = require('../error/customError');

/** 로그인 되어있는지 확인. */ 
exports.isLoggedIn = (req, res, next) => {
   if (req.isAuthenticated()) {
    next();
   } else {
    throw new Error('로인ㅣ 필요합니다.');
   }
};

/** 로그인 안 되어있는지 확인. */ 
exports.isNotLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      next();
   } else {
      const message = encodeURIComponent('로그인한 상태입니다.');
      throw new Error('이미 로그인한 상태입니다.');
   }
};

/** 토큰 만료 확인 */ 
exports.verifyToken = (req, res, next) => {
   try {
      req.decoded = jwt.verify(req.headers.isAuthenticated, process.env.JWT_SECRET);
      return next();
   } catch (err) {
      if (err.name === 'TokenExpiredError') {
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

/** 사용자 정의 에러인지 확인 (instanceof customclass).*/ 
exports.catchError = (err, message, next) => {
   console.error(err);

   if (err instanceof customclass){
      next(err);
   } else {
      throw new customclass(message);
   }
};