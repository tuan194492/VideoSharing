const express = require("express");

const VIDEO_STATUS = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    DELETED: 'DELETED'
}

const USER_ACTION = {
    WATCH: 'WATCH',
    SEARCH: 'SEARCH',
    LIKE: 'LIKE',
    DISLIKE: 'DISLIKE',
    COMMENT: 'COMMENT'
}

const USER_ACTION_POINT = {
    WATCH: 1,
    LIKE: 3,
    DISLIKE: -3,
    COMMENT: 5
}

const NOTIFY_ACTION = {
    POST_VIDEO: 'Post Video',
    COMMENT: 'Comment',
    SUBCRIBE: 'Subcribe',
    REACT_LIKE: 'Like',
    REACT_DISLIKE: 'Dislike'
}

const NOTIFY_STATUS = {
    READ: 'R',
    UN_READ: 'U'
}

const REACTION_TYPE = {
    LIKE: 'L',
    DISLIKE: 'D'
}

module.exports = {
    VIDEO_STATUS,
    NOTIFY_ACTION,
    NOTIFY_STATUS,
    REACTION_TYPE,
    USER_ACTION,
    USER_ACTION_POINT
}