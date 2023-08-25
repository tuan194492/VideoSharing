const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Reaction = sequelize.define('Reaction', {
    video_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    type: DataTypes.CHAR,
    created_at: DataTypes.DATE,
  });

module.exports = Reaction;