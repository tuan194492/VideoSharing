const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Subscriber = sequelize.define('Subscriber', {
    publisher_id: DataTypes.INTEGER,
    subscriber_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
  });
 
module.exports = Subscriber;