const express = require("express");
const Sequelize = require("sequelize");
const Video = require("../model/Video");
const User = require("../model/User");
const Reaction = require("../model/Reaction");
const Subcriber = require("../model/Subcriber");
const fileUtils = require("../utils/video/FileUtils");
const { VIDEO_STATUS, REACTION_TYPE, USER_ACTION} = require("../constant/enum/ENUM");
const {Log} = require("../model/Log");
const {Transcoder} = require("simple-hls")
const { getVideoDurationInSeconds } = require('get-video-duration')
const fs = require("fs");
const s3Serivce = require("./s3Service")
const { PassThrough } = require('stream');

const transcodeFile = async (filePath, parentPath) => {
  const t = new Transcoder(`${filePath}`, `${parentPath}`, {showLogs: true});
  try {
    const hlsPath = await t.transcode();
    console.log('Successfully Transcoded Video');
  } catch(e){
    console.log(e)
    console.log('Something went wrong');
  }
}

const MAX_LIMIT = 1024;
const createVideo = async (meta, file, user) => {
	const url = fileUtils.createUrlForVideo(file, user);
  const parentUrl = fileUtils.getUserPathForVideo(file, user);
	const shortenUrl = fileUtils.createShortenUrlForVideo(file, user);
	const storeResult = await storeVideo(file, url);
  console.log(file)
  const videoLength = await getVideoDurationInSeconds(url);
  console.log('Video length: ', videoLength)
  meta = {
    ...meta,
    duration: videoLength
  }
	console.log(storeResult);
	if (storeResult.success) {
		const ress = await createVideoMetaData(meta, shortenUrl, user);
		if (ress.success) {
			const videoId = ress.data;
      let storePath = parentUrl + '/' + videoId;
      if (!fs.existsSync(storePath)){    //check if folder already exists
        fs.mkdirSync(storePath);    //creating folder
      }
      await transcodeFile(url, storePath);
      return {
				success: true,
				message: "Upload File successful",
				videoId: videoId,
			};
		} else {
			return {
				success: false,
				message: ress.message,
			};
		}
	} else {
		return {
			success: false,
			message: storeResult.message,
		};
	}
};

const createVideoS3 = async (meta, file, user) => {
  const url = fileUtils.createUrlForVideo(file, user);
  const bufferStream = new PassThrough();
  bufferStream.end(file.data);
  const videoLength = await getVideoDurationInSeconds(bufferStream);
  console.log('Video length: ', videoLength)
  meta = {
    ...meta,
    duration: videoLength
  }
  const createVideoResult = await createVideoMetaData(meta, '', user);
  if (createVideoResult.success) {
    const videoId = createVideoResult.data;
    const baseVideoUrl = `${user.userId}/${videoId}/${file.name}`;
    const storeResult = await s3Serivce.uploadVideo(file, baseVideoUrl);
    const video = await Video.findByPk(videoId);
    if (storeResult.success) {
      video.url = baseVideoUrl;
      await video.save();
      return {
        success: true,
        message: "Upload File successful",
        videoId: videoId,
      };
    } else {
      await video.destroy();
      return {
        success: false,
        message: createVideoResult.message,
      };
    }
  } else {
    return {
      success: false,
      message: createVideoResult.message,
    };
  }
};

const getViewerVideoList = async (data) => {
	try {
		console.log(data);
		const page = parseInt(data.page) || 1;
		const pageSize = parseInt(data.pageSize) || 10;
		const result = await Video.findAndCountAll({
			where: {
				status: VIDEO_STATUS.PUBLIC
			},
			limit: pageSize,
			offset: (page - 1) * pageSize,
      include: [User]
		});
		return {
			success: true,
			message: "Get video list successfull",
			data: result,
		};
	} catch (e) {
		return {
			success: false,
			message: e,
		};
	}
};

const getVideoByPublisherId = async (data) => {
	try {
		console.log(data);
		const page = parseInt(data.page) || 1;
		const pageSize = parseInt(data.pageSize) || 10;
		if (data.userId == data.publisherId) {
			const result = await Video.findAndCountAll({
				where: {
					publisher_id: data.publisherId,
				},
				limit: pageSize,
				offset: page - 1,
        include: [User]
			});
			return {
				success: true,
				message: "Get video list successfull",
				data: result,
			};
		} else {
			const result = await Video.findAndCountAll({
				where: {
					publisher_id: data.publisherId,
					status: VIDEO_STATUS.PUBLIC
				},
				limit: pageSize,
				offset: page - 1,
			});
			return {
				success: true,
				message: "Get video list successfull",
				data: result,
			};
		}

	} catch (e) {
		return {
			success: false,
			message: e,
		};
	}
};

const updateVideo = async (videoData, thumbnail, id) => {
	try {
		const video = await Video.findByPk(id);
		if (video) {
			console.log(video);
			const { title, description } = videoData;
			video.title = title;
			video.description = description;
      if (thumbnail) {
        video.thumbnail = thumbnail;
      }
			await video.save();
			return {
				success: true,
				data: video,
			};
		} else {
			return {
				success: false,
				message: "Video is not found",
			};
		}
	} catch (e) {
		return {
			success: false,
			message: e,
		};
	}
};

const deleteVideoById = async (id) => {
	try {
		let video = await Video.findByPk(id);
		console.log(video.dataValues.id);
		if (video) {
			console.log("ABC DEF");
			video.status = VIDEO_STATUS.DELETED;
			await video.save(); // Soft delete
			return {
				success: true,
				data: video.dataValues,
				message: "Delete Video successful",
			};
		} else {
			return {
				success: false,
				message: "Video is not found",
			};
		}
	} catch (e) {
		return {
			success: false,
			message: e,
		};
	}
};

const createVideoMetaData = async (meta, url, user) => {
	const video = {
		title: meta.title || "",
		description: meta.description || "",
		url: url,
		publisher_id: user.userId,
		status: meta.isPublic ? VIDEO_STATUS.PUBLIC : VIDEO_STATUS.PRIVATE,
		thumbnail: meta?.thumbnail.data,
		views: 0,
    video_length_in_seconds: meta?.duration || 0
	};
	try {
		const videoId = await Video.create(video);
		return {
			success: true,
			message: "Create Video successful",
			data: videoId.id,
		};
	} catch (err) {
		console.log("Some err happend");
		return {
			success: false,
			message: err.parent.sqlMessage,
		};
	}
};

const storeVideo = (file, url) => {
	return new Promise((resolve, reject) => {
		file.mv(url, (err) => {
			let result;
			if (err) {
				result = {
					success: false,
					message: "Upload file not successful",
				};
				reject(result);
			} else {
				result = {
					success: true,
					message: "Upload file successful",
				};
				resolve(result);
			}
		});
	});
};

const findVideoById = async (id, guestId) => {
	try {
		console.log(guestId);
		const video = await Video.findByPk(id);

		if (video) {
			if (video.status == VIDEO_STATUS.PRIVATE && guestId != video.publisher_id) {
				return {
					success: false,
					message: "You can't access this video"
				}
			}
			const like = await Reaction.count({
				where: {
					video_id: id,
					type: REACTION_TYPE.LIKE,
				},
			});
			const dislike = await Reaction.count({
				where: {
					video_id: id,
					type: REACTION_TYPE.DISLIKE,
				},
			});
			let liked = false,
				disliked = false,
				subcribed = false;
			if (guestId) {
				liked = await Reaction.count({
					where: {
						video_id: id,
						user_id: guestId,
						type: REACTION_TYPE.LIKE,
					},
				});

				disliked = await Reaction.count({
					where: {
						video_id: id,
						user_id: guestId,
						type: REACTION_TYPE.DISLIKE,
					},
				});

				subcribed = await Subcriber.count({
					where: {
						subscriber_id: guestId,
						publisher_id: video.dataValues.publisher_id,
					},
				});
			}

			return {
				success: true,
				data: {
					...video.dataValues,
					likeCount: like,
					dislikeCount: dislike,
					liked: liked > 0 ? true : false,
					subcribed: subcribed > 0 ? true : false,
					disliked: disliked > 0 ? true : false,
				},
			};
		} else {
			return {
				success: false,
				message: "Video is not found",
			};
		}
	} catch (e) {
		console.log(e);
		return {
			success: false,
			message: "Video is not found " + e.parent.sqlMessage,
		};
	}
};

const fullTextSearchVideo = async (keyword, page, pageSize) => {
	try {
		// Define your search query
		const searchQuery = keyword;

		// Use Sequelize's `findAll` method with a `where` clause for full-text search
		const results = await Video.findAndCountAll({
			where: {
				[Sequelize.Op.or]: [
					Sequelize.literal(
						`MATCH(Video.title, Video.description) AGAINST('+${searchQuery}*' IN BOOLEAN MODE)`
					),
				],
			},
      include: User,
			page: page - 1,
			limit: pageSize,
			order: [['views', 'DESC']]
		});

		console.log("Search results:", results);
		return {
			success: true,
			data: results,
		};
	} catch (error) {
		console.error("Error performing search:", error);
		return {
			success: false,
			message: error,
		};
	}
};

const addViewForVideo = async (videoId) => {
	try {
		const video = await Video.findByPk(videoId);
		video.views++;
		await video.save();
	} catch (err) {
		console.log(err);
	}
};

const getMostWatchedVideos = async (videoNumbers) => {
	try {
		const videos = await Video.findAll({
			order: [
				['views', 'DESC']
			],
			limit: parseInt(videoNumbers)
		})

		return videos.map(video => video.id);
	} catch (err) {
		console.log(err);
		return [];
	}
}

const getLikedVideoByUser = async (userId) => {
  try {
      const result = await Video.findAndCountAll({
        where: {
        },
        include:
          {
            model: Reaction,
            where: {
              type: REACTION_TYPE.LIKE,
              user_id: userId
            },
            required: true
          },
        order: [
          [Reaction, 'createdAt', 'DESC']
        ]

      });
      return {
        success: true,
        message: "Get video list successfull",
        data: result,
      };
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
}

const getWatchedVideoList = async (userId, params) => {
	try {
    let {page, pageSize} = params;
    page = page? parseInt(page) : 1;
    pageSize = pageSize? parseInt(pageSize) : MAX_LIMIT;
    const logList = await Log.find({
			action: USER_ACTION.WATCH,
			userId: userId
		})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({
      createdAt: 'DESC'
    })
      .exec();

    const result = [];
    for (let watchedVideoLog of logList) {
        // console.log(watchedVideoLog);
       const watchedVideoData = await Video.findByPk(watchedVideoLog.videoId);
       // console.log(watchedVideoData);
       result.push({
         ...watchedVideoLog._doc,
         Video: watchedVideoData.dataValues
       });
    }

		return {
			success: true,
			data: result
		}

	} catch (err) {
		return {
			success: false,
			data: {}
		}
	}
}

const deleteWatchedHistory = async (userId) => {
  try {
    await Log.deleteMany({
      userId: userId,
      action: USER_ACTION.WATCH
    }).exec();
    return {
      success: true,
      message: "Delete watched history successful"
    }
  } catch (err) {
    return {
      success: false,
      message: err
    }
  }
}

const getTrendingVideos = async (page, pageSize) => {
  try {
    page = parseInt(page, 10)
    pageSize = parseInt(pageSize, 10)
    // Calculate skip value based on page and pageSize
    const skip = (page - 1) * pageSize;

    // Get the start date of last week
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    // Aggregate logs by videoId and count occurrences of USER_ACTION.WATCH
    const aggregationPipeline = [
      {
        $match: {
          action: USER_ACTION.WATCH,
          createdAt: { $gte: lastWeekStart } // Filter logs from last week
        }
      },
      {
        $group: {
          _id: "$videoId",
          totalWatchCount: { $sum: 1 } // Count occurrences of USER_ACTION.WATCH for each video
        }
      },
      {
        $sort: { totalWatchCount: -1 } // Sort by total watch count in descending order
      },
      {
        $skip: skip // Skip documents based on skip value
      },
      {
        $limit: pageSize // Limit the number of documents returned
      }
    ];

    // Execute aggregation pipeline
    const trendingVideos = await Log.aggregate(aggregationPipeline);
    const result = [];
    for (let video of trendingVideos) {
      const videoData = await Video.findByPk(video._id, {
        include: User
      });
      result.push({
       ...videoData.dataValues,
        watchCount: video.totalWatchCount
      });
    }
    return {
      success: true,
      data: result
    };
  } catch (err) {
    return {
      success: false,
      message: err
    };
  }
};

module.exports = {
	createVideo,
	findVideoById,
	updateVideo,
	deleteVideoById,
	getViewerVideoList,
	fullTextSearchVideo,
	getVideoByPublisherId,
	addViewForVideo,
	getMostWatchedVideos,
  	getLikedVideoByUser,
	getWatchedVideoList,
  deleteWatchedHistory,
  getTrendingVideos,
  createVideoS3
};
