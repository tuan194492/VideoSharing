const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Subscriber = sequelize.define('Subscriber', {
    publisher_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex'
    },
    subscriber_id: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex'
    },
    created_at: DataTypes.DATE,
  });
 
module.exports = Subscriber;