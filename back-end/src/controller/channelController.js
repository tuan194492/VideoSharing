const userService = require("../service/userService");
const channelService = require("../service/channelService");
const findChannelById = async (req, res, next) => {
  const result = await userService.getUserById(req.params.channelId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: result.user
    });
  } else {
      return res.status(400).json({
        success: false,
        message: result.message
      });
  }
}

const getChannelViewAnalyst = async (req, res, next) => {
  const result = await channelService.getViewCountByChannel(req.params.channelId, req.query?.startDate, req.query?.endDate);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: result.data
    });
  } else {
      return res.status(400).json({
        success: false,
        message: result.message
      });
  }
}

const getChannelSubscriberAnalyst = async (req, res, next) => {
  const result = await channelService.getSubscriberCountByChannel(req.params.channelId, req.query?.startDate, req.query?.endDate);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: result.data
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
}

const getMostWatchedVideos = async (req, res, next) => {
  const result = await channelService.mostWatchedVideoByDate(req.params.channelId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: result.data
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
}

const getChannelAnalytics = async (req, res, next) => {
  console.log('Query' + req.query)
  const result = await channelService.getChannelAnalyticsData(req.params.channelId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: result.data
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
}

const deleteWatchedVideo = async (req, res, next) => {
  const logId = req.params?.logId;
  const result = await channelService.deleteWatchedVideo(logId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: result.data
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
}

const searchChannel = async (req, res, next) => {
  let { keywords, page, pageSize } = req.query;
  console.log("��������� ~ file: channelController.js:133 ~ searchChannel ~ req.query:", req.query)
  const result = await channelService.searchChannel(
    keywords,
    page || 1,
    pageSize || 10
  );
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
      data: []
    });
  }
}


module.exports = {
  findChannelById,
  getChannelViewAnalyst,
  getChannelSubscriberAnalyst,
  getMostWatchedVideos,
  getChannelAnalytics,
  deleteWatchedVideo,
  searchChannel
}
