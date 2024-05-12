const sequelize = require("./sequelize");
const User = require("../../model/User");
const Video = require("../../model/Video");
const Comment = require("../../model/Comment");
const Reaction = require("../../model/Reaction");
const Subscriber = require("../../model/Subcriber");
const Notification = require("../../model/Notification");
const Playlist = require("../../model/Playlist");
const PlaylistVideo = require("../../model/PlaylistVideo");

const initRelation = () => {
    Video.belongsTo(User, { foreignKey: 'publisher_id' });
    Comment.belongsTo(User, { foreignKey: 'user_id' });
    Comment.belongsTo(Video, { foreignKey: 'video_id' });
    Reaction.belongsTo(User, { foreignKey: 'user_id' });
    Reaction.belongsTo(Video, { foreignKey: 'video_id' });
    Subscriber.belongsTo(User, { foreignKey: 'publisher_id' });
    Subscriber.belongsTo(User, { foreignKey: 'subscriber_id' });
    Notification.belongsTo(User, { foreignKey: 'actor' });
    Notification.belongsTo(User, { foreignKey: 'notifer' });
    Playlist.belongsTo(User, {foreignKey: 'publisher_id'})
    Video.belongsToMany(Playlist, {through: 'PlaylistVideo'});
    Playlist.belongsToMany(Video, {through: 'PlaylistVideo'});

}

const databaseInit = () => {
    initRelation();
    sequelize.sync()
        .then(() => {
            console.log('Models synchronized with the database.');
            // You can start your Express server or perform other operations here
        })
        .catch((error) => {
            console.error('Error synchronizing models:', error);
        });
}

module.exports = {
    sequelize,
    databaseInit
};
