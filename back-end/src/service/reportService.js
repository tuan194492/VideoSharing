const express = require("express");
const Report = require("../model/Report");
const {REPORT_STATUS} = require("../constant/enum/ENUM");

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
        reporter_id: reporterId
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
      if (!report.status !== REPORT_STATUS.PENDING) {
          return {
            success: false,
            message: "Report has been approved or rejected",
          };
      }
      report.status = REPORT_STATUS.APPROVED;
      report.approve_remark = approve_remark;
      await report.save();
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
