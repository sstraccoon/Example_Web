const Sequelize = require("sequelize");
const conn = {};
const sequelize = new Sequelize("example_board", "admin", "admincute", {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: "false",
  logging: false,
});

conn.sequelize = sequelize;
conn.Sequelize = Sequelize;

sequelize.connect();

module.exports = conn;
