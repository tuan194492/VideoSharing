const express = require("express");
const Report = require("../model/Report");
const {REPORT_STATUS, VIDEO_STATUS, USER_STATUS, REPORT_TYPE} = require("../constant/enum/ENUM");
const User = require("../model/User");
const Video = require("../model/Video");
const Comment = require("../model/Comment");
const commentService = require("./commentService");
const userService = require("./userService");

const createReport = async (type, videoId, commentId, channelId, reporterId, description) => {
  try {
    if (videoId === undefined || videoId === 'undefined') {
      videoId = 0;
    }
    console.log('Current comment id ', commentId)
    if (commentId === undefined || commentId === 'undefined') {
      console.log('comment id undifined')
      commentId = 0;
    }
    if (channelId === undefined || channelId === 'undefined') {
      channelId = 0;
    }

    const report = await Report.findOne({
      where: {
        type: type,
        video_id: videoId,
        comment_id: commentId,
        channel_id: channelId,
        reporter_id: reporterId,
        status: REPORT_STATUS.PENDING // Only count pending report
      }
    })
    if (report) {
      return {
        success: false,
        message: "Report already exists"
      }
    }
    await Report.create({
      type,
      video_id: videoId,
      comment_id: commentId,
      channel_id: channelId,
      reporter_id: reporterId,
      description,
      status: REPORT_STATUS.PENDING // Assuming new reports start with a 'Pending' status
    });

    return {
      success: true,
      message: "Report created successfully",
    };
  } catch (e) {
    console.log(e)
    return {
      success: false,
      message: e.message,
    };
  }
};

const getReportByUser = async (userId, page, pageSize) => {
  try {
    const result = await Report.findAndCountAll({
      where: {
        reporter_id: userId,
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      include: [
        {
          model: User,
          as: "Reporter",
          attributes: ["id", "name", "email"],
          required: false
        },
        {
          model: Video,
          as: "Video",
          attributes: ["id", "title"],
          required: false
        },
        {
          model: Comment,
          as: "Comment",
          attributes: ["id", "value"],
          required: false
        },
        {
          model: User,
          as: "Channel",
          attributes: ["id", "name"],
          required: false
        },
      ],
    });
    return {
      success: true,
      message: "Get report list successful",
      data: result,
    };
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
};

const approveReport = async (reportId, approve_remark) => {
  try {
    const report = await Report.findByPk(reportId);
    if (report) {
      if (report.status !== REPORT_STATUS.PENDING) {
          return {
            success: false,
            message: "Report has been approved or rejected",
          };
      }
      report.status = REPORT_STATUS.APPROVED;
      report.approve_remark = approve_remark;
      await report.save();
      switch (report.type) {
        case REPORT_TYPE.VIDEO:
          const video = await Video.findByPk(report.video_id);
          if (video) {
            video.status = VIDEO_STATUS.DELETED;
            await video.save();
          }
          break;
        case REPORT_TYPE.COMMENT:
          const comment = await Comment.findByPk(report.comment_id);
          const commentId = report.comment_id;
          report.comment_id = 0;
          await report.save();
          if (comment) {
            await commentService.deleteComment(commentId);
          }
          break;
        case REPORT_TYPE.USER:
          await userService.updateUserStatus(report.channel_id, USER_STATUS.SUSPEND);
          break;
      }
      return {
        success: true,
        message: "Report approved successfully",
      };
    } else {
      return {
        success: false,
        message: "Report not found",
      };
    }
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
};

const rejectReport = async (reportId, approve_remark) => {
  try {
    const report = await Report.findByPk(reportId);
    if (report) {
      if (report.status !== REPORT_STATUS.PENDING) {
        return {
          success: false,
          message: "Report has been approved or rejected",
        };
      }
      report.status = REPORT_STATUS.REJECTED;
      report.approve_remark = approve_remark;
      await report.save();
      return {
        success: true,
        message: "Report rejected successfully",
      };
    } else {
      return {
        success: false,
        message: "Report not found",
      };
    }
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
};

const getAllReportsForAdmin = async (page, pageSize) => {
  try {
    const result = await Report.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      include: [
        {
          model: User,
          as: "Reporter",
          attributes: ["id", "name", "email"],
          required: false
        },
        {
          model: Video,
          as: "Video",
          attributes: ["id", "title"],
          required: false
        },
        {
          model: Comment,
          as: "Comment",
          attributes: ["id", "value"],
          required: false
        },
        {
          model: User,
          as: "Channel",
          attributes: ["id", "name"],
          required: false
        },
        ],
      });
    return {
      success: true,
      message: "Get all reports successful",
      data: result,
    };
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
};

module.exports = {
  createReport,
  getReportByUser,
  approveReport,
  rejectReport,
  getAllReportsForAdmin,
};
