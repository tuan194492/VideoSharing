const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Video = sequelize.define('Video', {
    publisher_id: DataTypes.INTEGER,
    url: DataTypes.STRING,
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    keywords: DataTypes.STRING,
    status: DataTypes.CHAR,
    views: DataTypes.INTEGER,
    created_at: DataTypes.DATE,   
  }, {
      indexes: [
        {
          type: 'FULLTEXT',
          name: 'fulltext_index_name',
          fields: ['title', 'description'],
        },
      ], 
  });

module.exports = Video;