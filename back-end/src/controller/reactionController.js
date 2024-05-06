const express = require("express");
const videoService = require("../service/videoService");
const userService = require("../service/userService");
const notifyService = require("../service/notifyService");
const reactionService = require("../service/reactionService");
const loggingService = require("../service/loggingService");

const { REACTION_TYPE, NOTIFY_ACTION, USER_ACTION } = require("../constant/enum/ENUM");

const likeVideo = async (req, res, next) => {
  const userId = req.user.userId;
  const videoId = req.params.videoId;
  const result = await reactionService.likeVideo(userId, videoId);
  if (result.success) {
    const params = {
      actorId: req.user.userId,
      videoId: videoId,
      notifierId: 0,
    };
    notifyService.createNotifications(params, NOTIFY_ACTION.REACT_LIKE);
    loggingService.createLog({
        userId: req.user.userId,
        action: USER_ACTION.LIKE,
        videoId: videoId
    });
    return res.status(200).json({
      success: true,
      message: "Reacted successful",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }
};

const dislikeVideo = async (req, res, next) => {
    const userId = req.user.userId;
  const videoId = req.params.videoId;
  const result = await reactionService.dislikeVideo(userId, videoId);
  if (result.success) {
    const params = {
      actorId: req.user.userId,
      videoId: videoId,
      notifierId: 0,
    };
    notifyService.createNotifications(params, NOTIFY_ACTION.REACT_DISLIKE);
    loggingService.createLog({
        userId: req.user.userId,
        action: USER_ACTION.DISLIKE,
        videoId: videoId
    });
    return res.status(200).json({
      success: true,
      message: "Reacted successful",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }
};

const getReactStatusToVideo = async (req, res, next) => {
  const userId = req.user.userId;
  const videoId = req.params.videoId;
  const result = await reactionService.getUserReactionToVideo(userId, videoId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      isLiked: res.isLiked,
      isDisliked: res.isDisliked
    });
  } else {
    return res.status(400).json({
      success: false,
      isLiked: false,
      isDisliked: false,
      message: result.message,
    });
  }
}

module.exports = {
  likeVideo,
  dislikeVideo,
  getReactStatusToVideo
};
