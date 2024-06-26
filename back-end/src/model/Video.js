const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Video = sequelize.define('Video', {
    publisher_id: DataTypes.INTEGER,
    url: DataTypes.STRING,
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    keywords: DataTypes.STRING,
    commentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: DataTypes.CHAR,
    views: DataTypes.INTEGER,
    thumbnail: DataTypes.BLOB('long'),
    created_at: DataTypes.DATE,
    video_length_in_seconds: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    dislikeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
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
