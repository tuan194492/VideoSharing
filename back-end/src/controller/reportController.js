const express = require("express");
const reportService = require("../service/reportService");
const {ENUM} = require("sequelize");

const createReport = async (req, res, next) => {
  let { type, videoId, commentId, channelId, description } = req.body;
  const reporterId = req.user.userId;
  const result = await reportService.createReport(
    type,
    videoId,
    commentId,
    channelId,
    reporterId,
    description
  );

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

const getReportsByUser = async (req, res, next) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const result = await reportService.getReportByUser(userId, page, pageSize);

  if (result.success) {
    return res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }
};

const approveReport = async (req, res, next) => {
  const reportId = req.params.reportId;

  const result = await reportService.approveReport(reportId);

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

const rejectReport = async (req, res, next) => {
  const reportId = req.params.reportId;

  const result = await reportService.rejectReport(reportId);

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

const getAllReportsForAdmin = async (req, res, next) => {
  const page = parseInt(req.query?.page) || 1;
  const pageSize = parseInt(req.query?.pageSize) || 10;

  const result = await reportService.getAllReportsForAdmin(page, pageSize);

  if (result.success) {
    return res.status(200).json({
      success: true,
      data: result.data,
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
  createReport,
  getReportsByUser,
  approveReport,
  rejectReport,
  getAllReportsForAdmin,
};
