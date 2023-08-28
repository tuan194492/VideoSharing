const express = require("express");
const authRoute = require('./authRoute');
const videoRoute = require('./videoRoute');

const route = (app) => {
    app.use("/api/auth", authRoute);
    app.use("/api/video", videoRoute);
};

module.exports = route;
