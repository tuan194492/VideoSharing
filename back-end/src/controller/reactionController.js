const express = require("express");
const videoService = require("../service/videoService");
const userService = require("../service/userService");
const notifyService = require("../service/notifyService");
const reactionService = require("../service/reactionService");

const { REACTION_TYPE, NOTIFY_ACTION } = require("../constant/enum/ENUM");

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
    notifyService.createNotifications(params, NOTIFY_ACTION.REACT);
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
    notifyService.createNotifications(params, NOTIFY_ACTION.REACT);
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

module.exports = {
  likeVideo,
  dislikeVideo,
};
