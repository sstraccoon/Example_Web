const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.addUser = async (email, password, nick) => {
    try {
        console.log('join _ controller _ start');
        const exUser = await User.findOne({ where: { email }});
        if (exUser) {
            return false;
        } 
        console.log('join _ controller _ find _ END');
        const hash = await bcrypt.hash(password, 12);
        console.log('join _ controller _ hash _ END');
        await User.create({
            email,
            'password' : hash,
            nick
        });
        console.log('join _ controller _ END');
        return true;
    } catch (err) {
        console.log('join _ controller _ ERROR');
        console.error(err);
        return next(err);
    }
};

/* 
*/