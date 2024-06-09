const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Report = sequelize.define('Report', {
  type: DataTypes.CHAR,
  video_id: {
    type: DataTypes.INTEGER,
    required: false,
    defaultValue: null
  },
  comment_id: {
    type: DataTypes.INTEGER,
    required: false,
    defaultValue: null

  },
  channel_id: {
    type: DataTypes.INTEGER,
    required: false,
    defaultValue: null

  },
  reporter_id: DataTypes.INTEGER,
  description: DataTypes.TEXT,
  status: DataTypes.CHAR,
  approve_remark: DataTypes.TEXT
});

module.exports = Report;


