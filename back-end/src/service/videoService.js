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
const path = require('path');
const s3Serivce = require("./s3Service")
const { PassThrough } = require('stream');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
require('dotenv').config();
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

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

const createMasterPlaylist = async (baseFolder, videoId, resolutions) => {
  try {
    // Create master playlist content
    let masterPlaylistContent = '#EXTM3U\n#EXT-X-VERSION:3\n';

    resolutions.forEach((resolution, index) => {
      const { bandwidth, resolution: res } = resolution;
      const variantFileName = `${resolution.label}.m3u8`;
      masterPlaylistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${res}\n${variantFileName}\n`;

      // Create variant playlist file
      const variantFilePath = path.join(baseFolder, variantFileName);
      const variantPlaylistContent = `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:10\n#EXT-X-MEDIA-SEQUENCE:0\n#EXTINF:10.000,\nsegment-0.ts\n#EXTINF:10.000,\nsegment-1.ts\n#EXT-X-ENDLIST\n`;
      fs.writeFileSync(variantFilePath, variantPlaylistContent);

      console.log(`Created variant playlist: ${variantFilePath}`); // Log success
    });

    // Create master playlist file
    const masterPlaylistFilePath = path.join(baseFolder, 'master.m3u8');
    fs.writeFileSync(masterPlaylistFilePath, masterPlaylistContent);

    console.log(`Created master playlist: ${masterPlaylistFilePath}`); // Log success

    return masterPlaylistFilePath;
  } catch (error) {
    console.error('Error creating HLS playlists:', error);
    throw error;
  }
};

const createVideoS3 = async (meta, file, user) => {
  // const url = fileUtils.createUrlForVideo(file, user);
  const bufferStream = new PassThrough();
  bufferStream.end(file.data);
  const cdnLink = process.env.CDN_LINK;
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
    const baseVideoHlsUrl = `${user.userId}/${videoId}/hls`;
    const storeResult = await s3Serivce.uploadVideo(file, baseVideoUrl);

    // Write the input buffer to a temporary file
    const tempInputFilePath = path.join('/tmp', `${file.name}`);
    fs.writeFileSync(tempInputFilePath, file.data);

    const hlsFolderPath = `/tmp/${videoId}`; // Temporary folder for HLS files
    fs.mkdirSync(hlsFolderPath, { recursive: true });
    const inputBufferStream = new PassThrough();
    inputBufferStream.end(file.data);

    // Video resolutions to encode
    const videoResolutions = [
      { resolution: '640x360', bitrate: '800k', bandwidth: 800000, label: 360 },
      { resolution: '1280x720', bitrate: '2800k', bandwidth: 2800000, label: 720 },
      // { resolution: '1920x1080', bitrate: '5000k', bandwidth: 5000000, label: 1080 }
    ];

    const transcodePromises = videoResolutions.map(async (resolution) => {
      const { resolution: res, bitrate } = resolution;
      const outputFolder = `${hlsFolderPath}/${res}`;
      fs.mkdirSync(outputFolder, { recursive: true });

      return new Promise((resolve, reject) => {
        ffmpeg(tempInputFilePath)
          .outputOptions([
            '-vf', `scale=${res}`,
            '-b:v', bitrate,
            '-c:a', 'aac',
            '-profile:v', 'main',
            '-crf', '20',
            '-hls_time', '10', // Segment duration (e.g., 10 seconds)
            '-hls_list_size', '0', // Number of playlist entries (0 means keep all)
            '-hls_segment_filename', `${outputFolder}/${resolution.label}-%03d.ts`, // Segment filename pattern
            '-f', 'hls',
            '-hls_segment_type', 'mpegts',
          ])
          .output(`${outputFolder}/${resolution.label}.m3u8`) // Adjusted output path
          .on('start', commandLine => {
            console.log('Spawned FFmpeg with command: ' + commandLine);
          })
          .on('progress', progress => {
            console.log(`Processing: ${progress.percent}% done`);
          })
          .on('stderr', stderrLine => {
            console.log('Stderr output: ' + stderrLine);
          })
          .on('end', resolve)
          .on('error', reject)
          .run();
      });
    });

    await Promise.all(transcodePromises);

    const masterPlaylistPath = await createMasterPlaylist(hlsFolderPath, videoId, videoResolutions);

    const uploadPromises = [];
    // Upload HLS files to S3
    videoResolutions.forEach((resolution) => {
      const { resolution: res } = resolution;
      const resolutionFolder = `${hlsFolderPath}/${res}`;
      const playlistPath = `${resolutionFolder}/index.m3u8`;

      const files = fs.readdirSync(resolutionFolder);
      files.forEach((file) => {
        const filePath = path.join(resolutionFolder, file);
        const fileData = fs.readFileSync(filePath);
        const s3Path = path.join(`${baseVideoHlsUrl}`, file);
        uploadPromises.push(s3Serivce.uploadVideo({ name: file, data: fileData }, s3Path));
      });
    });

    const masterPlaylistData = fs.readFileSync(masterPlaylistPath);
    const masterPlaylistS3Path = `${baseVideoHlsUrl}/index.m3u8`;
    uploadPromises.push(s3Serivce.uploadVideo({ name: 'index.m3u8', data: masterPlaylistData }, masterPlaylistS3Path));

    const storeResults = await Promise.all(uploadPromises);
    const allSuccess = storeResults.every(result => result.success);

    const video = await Video.findByPk(videoId);
    // Delete temporary HLS files and input file

    fs.rmdirSync(hlsFolderPath, { recursive: true });
    fs.unlinkSync(tempInputFilePath);
    console.log('Temporary files deleted:', hlsFolderPath, tempInputFilePath);

    if (allSuccess && storeResult.success) {
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
			console.log("Video update data ", JSON.stringify(videoData));
			video.title = title;
			video.description = description;
			video.status = videoData.status;

			if (thumbnail) {
				video.thumbnail = thumbnail?.data;
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
			console.log("Delete Video");
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
		let video = await Video.findByPk(id, {
			include: [User]
		});

		if (video) {
			video = {
				...video,
				user_name: video.User?.name
			}

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
				status: VIDEO_STATUS.PUBLIC
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
	  if (videoData.dataValues.status === VIDEO_STATUS.PUBLIC) {
		  result.push({
			  ...videoData.dataValues,
			  watchCount: video.totalWatchCount
		  });
	  }

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
