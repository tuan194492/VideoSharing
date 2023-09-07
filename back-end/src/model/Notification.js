const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Notification = sequelize.define('Notification', {
    actor_id: DataTypes.INTEGER,
    notifer_id: DataTypes.INTEGER,
    video_id: DataTypes.INTEGER,
    status: DataTypes.CHAR,
    type: DataTypes.STRING,
    created_at: DataTypes.DATE,
  });

module.exports = Notification;