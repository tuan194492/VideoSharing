const express = require("express");
const authRoute = require('./authRoute');
const videoRoute = require('./videoRoute');
const commentRoute = require('./commentRoute');
const subcriberRoute = require("./subcriberRoute");
const notifyRoute = require("./notifyRoutes");
const reactionRoute = require("./reactionRoute");
const channelRoute = require("./channelRoute");
const playlistRoute = require("./playlistRoute");
const reportRoute = require("./reportRoute");

const route = (app) => {
    app.use("/api/auth", authRoute);
    app.use("/api/video", videoRoute);
    app.use("/api/comment", commentRoute);
    app.use("/api/subcriber", subcriberRoute);
    app.use("/api/notifications", notifyRoute);
    app.use("/api/react", reactionRoute);
    app.use("/api/channel", channelRoute);
    app.use("/api/playlist", playlistRoute);
    app.use("/api/report", reportRoute);

};

module.exports = route;
