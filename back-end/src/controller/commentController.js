const express = require("express");

const videoService = require("../service/videoService");
const commentService = require("../service/commentService");

const getCommentsByVideo = async (req, res, next) => {
  const id = req.params.videoId;
  const result = await videoService.findVideoById(id);
  if (result.success) {
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const getCommentsResult = await commentService.getCommentByVideo(
      id,
      page,
      pageSize
    );
    if (getCommentsResult.success) {
      return res.status(200).json({
        success: true,
        data: getCommentsResult.data,
        message: "Get Comment list successful",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: getCommentsResult.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }
};

const addComment = async (req, res, next) => {
  const videoId = req.params.videoId;
  console.log(req.user)
  const result = await commentService.addComment(req.body.comment, req.user, videoId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }
};

const deleteComment = async (req, res, next) => {
  const id = req.params.commentId;
  const comment = await commentService.findCommentById(id);
  if (comment) {
    console.log(comment);
    if (comment.user_id != req.user.userId) {
        return res.status(403).json({
            success: false,
            message: "Only own use can delete this comment",
          });
    }
  } else {
    return res.status(400).json({
        success: false,
        message: "Comment not found",
      });
  }
  const result = await commentService.deleteComment(id);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }
};

module.exports = {
  getCommentsByVideo,
  addComment,
  deleteComment,
};
