const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelise) {
    return super.init(
      {
        id: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        phone: {
          type: Sequelize.STRING(11),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        agree: {
          type: Sequelize.ENUM("agree", "disagree"),
          allowNull: false,
        },
        grade: {
          type: Sequelize.ENUM("user", "admin"),
          defaultValue: "user",
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {}
};
