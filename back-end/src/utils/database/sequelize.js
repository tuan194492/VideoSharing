const Sequelize = require("sequelize");
require('dotenv').config();

// const sequelize = new Sequelize("video_sharing", "root", "gapo0903", {

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

module.exports = sequelize;
