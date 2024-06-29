const sequelize = require("../utils/database/sequelize");
const { DataTypes } = require('sequelize');

const Setting = sequelize.define('Setting', {
  view_count_percent: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  point_for_like: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  point_for_dislike: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  point_for_watch: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  point_for_comment: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Setting;
