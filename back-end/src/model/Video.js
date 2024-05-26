const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Video = sequelize.define('Video', {
    publisher_id: DataTypes.INTEGER,
    url: DataTypes.STRING,
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    keywords: DataTypes.STRING,
    commentCount: DataTypes.INTEGER,
    status: DataTypes.CHAR,
    views: DataTypes.INTEGER,
    thumbnail: DataTypes.BLOB('long'),
    created_at: DataTypes.DATE,
    video_length_in_seconds: DataTypes.INTEGER,
    likeCount: DataTypes.INTEGER,
    dislikeCount: DataTypes.INTEGER,
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
