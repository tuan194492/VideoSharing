const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const PlaylistVideo = sequelize.define('PlaylistVideo', {
    playlist_id: DataTypes.INTEGER,
    video_id: DataTypes.INTEGER
});

module.exports = PlaylistVideo;