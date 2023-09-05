const express = require("express");
const authRoute = require('./authRoute');
const videoRoute = require('./videoRoute');
const commentRoute = require('./commentRoute');

const route = (app) => {
    app.use("/api/auth", authRoute);
    app.use("/api/video", videoRoute);
    app.use("/api/comment", commentRoute);
};

module.exports = route;
