const express = require("express");

const VIDEO_STATUS = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    DELETED: 'DELETED'
}

const USER_STATUS = {
  ACTIVE: 'A',
  SUSPEND: 'S'
}

const USER_ACTION = {
    WATCH: 'WATCH',
    LIKE: 'LIKE',
    DISLIKE: 'DISLIKE',
    COMMENT: 'COMMENT',
    UNDO_LIKE: 'UNDO_LIKE',
    UNDO_DISLIKE: 'UNDO_DISLIKE'
}

const USER_ACTION_POINT = {
    WATCH: 1,
    LIKE: 3,
    UNDO_LIKE: -3,
    UNDO_DISLIKE: 3,
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

const REPORT_STATUS = {
  APPROVED: 'A',
  PENDING: 'P',
  REJECTED: 'R'
}

const REPORT_TYPE = {
  VIDEO: 'V',
  USER: 'U',
  COMMENT: 'C'
}

const COMMENT_STATUS = {
  ACTIVE: 'A',
  DELETED: 'D'
}

module.exports = {
    VIDEO_STATUS,
    NOTIFY_ACTION,
    NOTIFY_STATUS,
    REACTION_TYPE,
    USER_ACTION,
    USER_ACTION_POINT,
    REPORT_STATUS,
    REPORT_TYPE,
    USER_STATUS,
    COMMENT_STATUS
}
