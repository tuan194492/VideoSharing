const express = require("express");
const fs = require("fs");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 15 * 60 });
const videoService = require("../service/videoService");
const userService = require("../service/userService");
const notifyService = require("../service/notifyService");
const loggingService = require("../service/loggingService");
const recommenderService = require("../service/recommenderService");
const { NOTIFY_ACTION, USER_ACTION, VIDEO_STATUS } = require("../constant/enum/ENUM");
const VIEW_COUNT_PERCENT = 1;
const viewLogs = new Map();
const getVideoDataById = async (req, res, next) => {};

const createVideo = async (req, res, next) => {
	const file = req.files.file;
	const thumbnail = req.files.thumbnail;
	const meta = {
		...req.body,
		thumbnail,
	};
	console.log(req.user);
	const result = await videoService.createVideo(meta, file, req.user);
	if (result.success) {
		const params = {
			actorId: req.user.userId,
			videoId: result.videoId,
			notifierId: 0,
		};
		notifyService.createNotifications(params, NOTIFY_ACTION.POST_VIDEO);
		return res.status(201).json({
			message: "Upload video successful",
		});
	} else {
		return res.status(500).json({
			message: result.message,
		});
	}
};

const updateVideo = async (req, res, next) => {
	const id = req.params.id;
	const result = await videoService.updateVideo(req.body, id);
	if (result.success) {
		return res.status(200).json({
			success: true,
			data: result.data,
		});
	} else {
		return res.status(400).json({
			success: false,
			message: result.message,
		});
	}
};

const deleteVideo = async (req, res, next) => {
	const id = req.params.id;
	const result = await videoService.deleteVideoById(id);
	console.log(result);
	if (result.success) {
		return res.status(200).json({
			success: true,
			data: result.data,
			message: "Delete Video successful",
		});
	} else {
		return res.status(400).json({
			success: false,
			message: result.message,
		});
	}
};

const getVideoById = async (req, res, next) => {
  const id = req.params.id;
  const result = await videoService.findVideoById(id, req?.user?.userId);
  if (result.success) {
    const user = await userService.getUserById(result.data.publisher_id);
    return res.status(200).json({
      success: true,
      data: {
        ...result.data,
        user_name: user?.name || "No name",
		subcriberCount: user?.subcriberCount,
		postedSince: ((new Date()).getTime() - result.data.createdAt) / 1000
      }
    });
  } else {
    return res.status(400).json({ 
      success: false,
      message: result.message,
    });
  }
};

const streamVideoById = async (req, res, next) => {
  try {
    // console.log("Request from", req.socket);
    const id = req.params.id;
    console.log("Video id", id);
    let videoPath = "";
    // Can use cache to store url for Id video
    if (!cache.has(id)) {
      const videoPathResult = await videoService.findVideoById(id, req?.query?.userId);
      if (!videoPathResult.success) {
        return res.status(404).json({
          success: false,
          message: "Can't not find video",
        });
      }
      videoPath = "public/" + videoPathResult.data.url; // back-end\public\1\sample.mp4
      cache.set(id, videoPath);
    } else {
      videoPath = cache.get(id);
    }

		const range = req.headers.range;
		if (!range) {
			return res.status(400).send("Requires Range header");
		}
		const videoSize = fs.statSync(videoPath).size;
		const CHUNK_SIZE = 10 ** 6; // 1MB
		const start = Number(range.replace(/\D/g, ""));
		const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
		const contentLength = end - start + 1;
		const headers = {
			"Content-Range": `bytes ${start}-${end}/${videoSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": contentLength,
			"Content-Type": "video/mp4",
		};

		res.writeHead(206, headers);
		if (end > videoSize || start > videoSize) {
			return res.status(400).json({
				success: false,
				message: err,
			});
		}
		const videoStream = fs.createReadStream(videoPath, { start, end });
		console.log("Request from user", req.query?.userId);
		if (req.query?.userId) {
			if (!viewLogs.has(id)) {
				viewLogs.set(id, new Map());
			}
			console.log(contentLength / videoSize);
			console.log(
				"Previous percent watched",
				viewLogs.get(id).get(req.query?.userId) || 0
			);

			console.log("Start and end", start, end);

			viewLogs
				.get(id)
				.set(
					req.query?.userId,
					(viewLogs.get(id).get(req.query?.userId) || 0) +
						contentLength / videoSize
				);
			console.log(
				"Current percent watched",
				viewLogs.get(id).get(req.query?.userId) || 0
			);
			if (viewLogs.get(id).get(req.query?.userId) > VIEW_COUNT_PERCENT) {
				viewLogs.get(id).delete(req.query?.userId);
				videoService.addViewForVideo(id);
				loggingService.createLog({
					userId: req.query?.userId,
					action: USER_ACTION.WATCH,
					videoId: id,
				});
			}
		}
		videoStream.pipe(res);
	} catch (err) {
		return res.status(400).json({
			success: false,
			message: err,
		});
	}
};

const getViewerVideoList = async (req, res, next) => {
	console.log(req.body)
	console.log(req.query)
	const result = await videoService.getViewerVideoList(req.query);

	if (result.success) {
		let videos = [];
		const currentDate = new Date();
		for (let video of result.data.rows) {
			const user = await userService.getUserById(
				video.dataValues.publisher_id
			);
			videos.push({
				...video.dataValues,
				user_name: user?.name || "No name",
				postedSince: (currentDate.getTime() - video.createdAt) / 1000
			});
		}
		return res.status(200).json({
			success: true,
			count: result.data.count,
			data: videos,
		});
	} else {
		return res.status(400).json({
			success: false,
			message: result.message,
		});
	}
};

const getVideoByPublisherId = async (req, res, next) => {
	const userId = req?.user?.userId;
	const result = await videoService.getVideoByPublisherId({
		...req.params,
		...req.body,
		userId: userId
	});
	if (result.success) {
		let videos = [];
		for (let video of result.data.rows) {
			const user = await userService.getUserById(
				video.dataValues.publisher_id
			);
			if (video.dataValues.publisher_id != userId && video.dataValues.status != VIDEO_STATUS.PUBLIC) {
				continue;
			} else {
				videos.push({
					...video.dataValues,
					user_name: user?.name || "No name",
				});
			}
			
		}
		return res.status(200).json({
			success: true,
			count: result.data.count,
			data: videos,
		});
	} else {
		return res.status(400).json({
			success: false,
			message: result.message,
		});
	}
};

const searchVideos = async (req, res, next) => {
	let { keyword, page, pageSize } = req.body;
	console.debug("🚀🚀🚀 ~ file: videoController.js:248 ~ searchVideos ~ req.body:", req.body)
	console.log("Searching video");
	console.log(keyword);
	const result = await videoService.fullTextSearchVideo(
		keyword,
		page || 1,
		pageSize || 10
	);
	if (result.success) {
		return res.status(200).json({
			success: true,
			data: result.data,
		});
	} else {
		return res.status(400).json({
			success: false,
			message: result.message,
		});
	}
};

const getSimilarUsers = async (req, res, next) => {
	const videoIds = await recommenderService.getRecommendVideoListByUser(req.params.userId);
	const videos = [];
	for (let videoId of videoIds) {
		const video = await videoService.findVideoById(videoId, req.params.userId);
		videos.push(video);
	}
	return res.status(200).json({
		data: 'hihi',
		count: videos.length,
		videos: videos
	});
}

module.exports = {
	createVideo,
	updateVideo,
	deleteVideo,
	getVideoById,
	getVideoDataById,
	streamVideoById,
	getViewerVideoList,
	searchVideos,
	getVideoByPublisherId,
	getSimilarUsers
};
