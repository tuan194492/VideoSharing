const sequelize = require("./sequelize");
const User = require("../../model/User");
const Video = require("../../model/Video");
const Comment = require("../../model/Comment");
const Reaction = require("../../model/Reaction");
const Subscriber = require("../../model/Subcriber");
const Notification = require("../../model/Notification");
const Playlist = require("../../model/Playlist");
const PlaylistVideo = require("../../model/PlaylistVideo");
const Report = require("../../model/Report");

const initRelation = () => {
    Video.belongsTo(User, { foreignKey: 'publisher_id' });
    Comment.belongsTo(User, { foreignKey: 'user_id' });
    Comment.belongsTo(Video, { foreignKey: 'video_id' });
    Reaction.belongsTo(User, { foreignKey: 'user_id' });
    Reaction.belongsTo(Video, { foreignKey: 'video_id' });
    Subscriber.belongsTo(User, { as: 'Publisher', foreignKey: 'publisher_id' });
    Subscriber.belongsTo(User, { as: 'user', foreignKey: 'subscriber_id' });
    Report.belongsTo(User, { as: 'Reporter', foreignKey:'reporter_id', onUpdate: 'NO ACTION' });
    Report.belongsTo(Video, { as: 'Video', foreignKey:'video_id', onUpdate: 'NO ACTION' });
    Report.belongsTo(Comment, { as: 'Comment', foreignKey:'comment_id', onUpdate: 'NO ACTION' });
    Report.belongsTo(User, { as: 'Channel', foreignKey:'channel_id', onUpdate: 'NO ACTION' });
    Notification.belongsTo(User, { as: 'Actor', foreignKey: 'actor_id', onUpdate: 'NO ACTION' });
    Notification.belongsTo(User, { as: 'Notifier', foreignKey: 'notifer_id', onUpdate: 'NO ACTION'});
    Notification.belongsTo(Video, { as: 'Video', foreignKey: 'video_id', onUpdate: 'NO ACTION' });


    Playlist.belongsTo(User, {foreignKey: 'publisher_id'})
    Video.belongsToMany(Playlist, {through: 'PlaylistVideo'});
    Playlist.belongsToMany(Video, {through: 'PlaylistVideo'});

    Video.hasMany(Reaction, {foreignKey: 'video_id'});
    User.hasMany(Video, {foreignKey: 'publisher_id'});


}

const databaseInit = () => {
    initRelation();
    sequelize.sync({alter:false})
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
