const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    name: DataTypes.STRING,
    shortname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.CHAR,
    avatar: DataTypes.BLOB,
    created_at: DataTypes.DATE,
    subscriberCount: DataTypes.NUMBER,
    facebook: DataTypes.STRING,
    description: DataTypes.STRING
  });

module.exports = User
