const Sequelize = require("sequelize");

const sequelize = new Sequelize("video_sharing", "root", "#Tuan267", {
    host: "localhost",
    dialect: "mysql",
  });

module.exports = sequelize;