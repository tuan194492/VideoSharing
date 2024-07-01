const express = require("express");
const { Log } = require("../model/Log");
const { RecommendPoints } = require("../model/RecommendPoints");
const { WatchedVideo } = require("../model/WatchedVideo");
const Setting = require("../model/Setting");
const { USER_ACTION_POINT, USER_ACTION } = require("../constant/enum/ENUM");
const Video = require("../model/Video");
/*
    Params:
        userId: id người dùng
        action: lọai hành động. Ở đây ta quan tâm tới các hành động: WATCH, SEARCH, LIKE, DISLIKE, COMMENT
        videoId: id của video
        createdAt: thời điểm của hành động
*/
const createLog = async (params) => {
  const video = await Video.findByPk(params.videoId);
  if (params.watchTime) {
    const log = new Log({
      userId: params.userId,
      action: params.action,
      videoId: params.videoId,
      channelId: video.publisher_id,
      watchTime: params.watchTime,
    });

    log.save();
  } else {
    const log = new Log({
      userId: params.userId,
      action: params.action,
      videoId: params.videoId,
      channelId: video.publisher_id,
    });

    log.save();
  }

	// Change react point
  if (params.userId) {
    const recommendPoint = await RecommendPoints.findOne({
      userId: params.userId,
      videoId: params.videoId,
    }).exec();
    if (!recommendPoint) {
      const data = new RecommendPoints({
        userId: params.userId,
        point: getUserActionPoint(params.action),
        videoId: params.videoId,
      });
      data.save();
    } else {
      const newPoint = await getUserActionPoint(params.action);
      recommendPoint.point = recommendPoint.point + newPoint;
      recommendPoint.save();
    }
    const watchedVideo = await WatchedVideo.findOne({
      userId: params.userId,
      videoId: params.videoId,
    }).exec();
    if (!watchedVideo) {
      const data = new WatchedVideo({
        userId: params.userId,
        timeWatched: 1,
        videoId: params.videoId,
      });
      data.save();
    } else {
      watchedVideo.timeWatched = watchedVideo.timeWatched + 1;
      watchedVideo.save();
    }
  }


};

const getUserActionPoint = async (action) => {
  const setting = await Setting.findOne();
  console.log('Setting', JSON.stringify(setting))
	switch (action) {
		case USER_ACTION.LIKE:
			return setting ? parseInt(setting.point_for_like) : USER_ACTION_POINT.LIKE;
		case USER_ACTION.DISLIKE:
			return setting ? parseInt(setting.point_for_dislike) : USER_ACTION_POINT.DISLIKE;
		case USER_ACTION.WATCH:
			return setting ? parseInt(setting.point_for_watch) : USER_ACTION_POINT.WATCH;
		case USER_ACTION.COMMENT:
			return setting ? parseInt(setting.point_for_comment) : USER_ACTION_POINT.COMMENT;
		default:
			return 0;
	}
};

module.exports = {
	createLog,
};
