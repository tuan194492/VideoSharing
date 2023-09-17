const express = require("express");
const {Log} = require("../model/Log");
/*
    Params:
        userId: id người dùng
        action: lọai hành động. Ở đây ta quan tâm tới các hành động: WATCH, SEARCH, LIKE, DISLIKE, COMMENT
        videoId: id của video
        createdAt: thời điểm của hành động
*/
const createLog = async (params) => {
    const log = new Log({
        userId: params.userId,
        action: params.action,
        videoId: params.videoId
    });
    log.save();
}

module.exports = {
    createLog
}


