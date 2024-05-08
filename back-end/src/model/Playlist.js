const sequelize = require("../utils/database/sequelize")
const { DataTypes } = require('sequelize');

const Playlist = sequelize.define('Playlist', {
    publisher_id: DataTypes.INTEGER,
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    status: DataTypes.CHAR
}, {
    indexes: [
        {
            type: 'FULLTEXT',
            name: 'fulltext_index_name',
            fields: ['title', 'description'],
        },
    ],
});

module.exports = Playlist;