const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            contemt: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Comment',
            tableName: 'comments',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
 
    static associate(db) {
        // db.Comment.belongsTo(db.User);
        // user 를 관계에 넣으면 에러 발생, UserId가 두개나 참조 된다는 문제
        // 이미 포스트에 유저 정보가 있어서 그런 듯
        db.Comment.belongsTo(db.Board);
        // 대댓글을 위한 관계 추가 belongsTo가 있어야 하는가 했는데 별로 필요 없는 듯
        db.Comment.hasMany(db.Comment, {
            foreignKey:  'originCommentId',
            as: 'reComment',
        });
    }
}