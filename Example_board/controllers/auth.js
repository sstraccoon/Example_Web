const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const controllerError = require('../error/controllerError');

exports.addUser = async (email, password, nick) => {
    try {
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            'password' : hash,
            nick
        });
        return true;
    } catch (err) {
        console.error(err);
        throw new controllerError('계정 추가에 실패했습니다.');
    }
};

exports.getUser = async (email) => {
    try {
        return await User.findOne({ where : { email }});
    } catch (err) {
        console.error(err);
        throw new controllerError('유저 검색에 실팼습니다.');
    }
}

/* 
*/