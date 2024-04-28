const express = require("express");
const Video = require("../model/Video");
const Comment = require("../model/Comment");

const addComment = async (comment, sender, videoId) => {
  try {
    await Comment.create({
      user_id: sender.userId,
      video_id: videoId,
      value: comment,
    });
    return {
      success: true,
      message: "Post comment successful",
    };
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
};

const findCommentById = async (id) => {
    const comment = await Comment.findByPk(id);
    if (comment != null) {
      return comment.dataValues;
    } else {
      return null;
    }
}

const getCommentByVideo = async (videoId, page, pageSize) => {
  try {
    const result = await Comment.findAndCountAll({
      where: {
        video_id: videoId,
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    return {
      success: true,
      message: "Get comment list successfull",
      data: result,
    };
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
};

const deleteComment = async (commentId) => {
  try {
    await Comment.destroy({
      where: {
        id: commentId,
      },
    });
    return {
      success: true,
      message: "Delete comment successful",
    };
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
};

module.exports = {
  addComment,
  getCommentByVideo,
  deleteComment,
  findCommentById
};
