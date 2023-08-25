const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Video = sequelize.define('Video', {
    publisher_id: DataTypes.INTEGER,
    url: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    keywords: DataTypes.STRING,
    status: DataTypes.CHAR,
    views: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
  });

module.exports = Video;