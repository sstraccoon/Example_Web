const Sequelize = require("sequelize");

module.exports = class Board extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        viewCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        likeCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        hateCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "board",
        tableName: "boards",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Board.belongsTo(db.User, {
      foreignKey: "userId",
      sourceKey: "id",
    });
    db.Board.belongsToMany(db.User, {
      foreignKey: "boardId",
      through: "likeboards",
      as: "LikeBoard",
    });
    db.Board.belongsToMany(db.User, {
      foreignKey: "boardId",
      through: "hateboards",
      as: "HateBoard",
    });
    db.Board.hasMany(db.Comment, {
      foreignKey: "boardId",
    });
  }
};
