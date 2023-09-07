const express = require("express");

const VIDEO_STATUS = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    DELETED: 'DELETED'
}

const NOTIFY_ACTION = {
    POST_VIDEO: 'Post Video',
    COMMENT: 'Comment',
    SUBCRIBE: 'Subcribe'
}

const NOTIFY_STATUS = {
    READ: 'R',
    UN_READ: 'U'
}

module.exports = {
    VIDEO_STATUS,
    NOTIFY_ACTION,
    NOTIFY_STATUS
}