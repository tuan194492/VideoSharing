const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const PlaylistVideo = sequelize.define('PlaylistVideo', {
});

module.exports = PlaylistVideo;
