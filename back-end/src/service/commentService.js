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

    const video = await Video.findByPk(videoId);
    if (video) {
      video.commentCount++;
      await video.save();
      console.log('begin emitting'); //

    }


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
    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: Video,
          as: 'Video'
        }
      ]
    });
    if (comment == null) {
      return {
        success: true,
        message: "Delete comment successful",
      };
    }
    console.log(comment);
    const video = comment.Video;
    if (video) {
      video.commentCount--;
      await video.save();
    }
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
