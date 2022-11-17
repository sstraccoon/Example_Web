const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
            state: {
                type: Sequelize.ENUM('activation', 'disabled'),
                allowNull: false,
                defaultValue: 'activation',
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Board, {
            foreignKey: 'userId',
        });
        db.User.hasMany(db.Comment, {
            foreignKey: 'userId',
        });
        db.User.belongsToMany(db.Board, {
            foreignKey: 'userId',
            as: 'LikeBoard',
            through: 'likeboards',
        });
        db.User.belongsToMany(db.Board, {
            foreignKey: 'userId',
            as: 'HateBoard',
            through: 'hateboards'
        });
    }
};