const Sequelize = require("sequelize");

const sequelize = new Sequelize("video_sharing", "root", "gapo0903", {
    host: "localhost",
    dialect: "mysql",
  });

module.exports = sequelize;