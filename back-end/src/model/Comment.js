const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Comment = sequelize.define('Comment', {
    user_id: DataTypes.INTEGER,
    video_id: DataTypes.INTEGER,
    value: DataTypes.TEXT,
    created_at: DataTypes.DATE,
  });

module.exports = Comment;