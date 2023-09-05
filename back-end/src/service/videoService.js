const express = require("express");
const Video = require("../model/Video");
const fileUtils = require("../utils/video/FileUtils");
const { VIDEO_STATUS } = require("../constant/enum/ENUM");

const createVideo = async (meta, file, user) => {
  const url = fileUtils.createUrlForVideo(file, user);
  const shortenUrl = fileUtils.createShortenUrlForVideo(file, user);
  const storeResult = await storeVideo(file, url);
  console.log(storeResult);
  if (storeResult.success) {
    await createVideoMetaData(meta, shortenUrl, user);
    return {
        success: true,
        message: "Upload File successful"
    }
  } else {
    return {
        success: false,
        message: storeResult.message
    }
  }
  
};

const updateVideo = async (videoData, id) => {
  const video = await Video.findByPk(id);
    if (video) {
        video = {
          ...video,
          videoData
        }
        await video.save();
        return {
            success: true,
            data: video
        }
    } else {
        return {
            success: false,
            message: "Video is not found"
        }
    }
};

const deleteVideoById = async (id) => {
  const video = await Video.findByPk(id);
    if (video) {
        video = {
          ...video,
          status: VIDEO_STATUS.DELETED
        }
        await video.save(); // Soft delete
        return {
            success: true,
            data: video,
            message: "Delete Video successful"
        }
    } else {
        return {
            success: false,
            message: "Video is not found"
        }
    }
};

const createVideoMetaData = async (meta, url, user) => {
  const video = {
    ...meta,
    url: url,
    publisher_id: user.userId,
    status: VIDEO_STATUS.PUBLIC,
    views: 0,
  };

  console.log(video)
  try {
    await Video.create(video);
    return {
      success: true,
      message: "Create Video successful",
    };
  } catch (err) {
    return {
      success: false,
      message: err,
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

const findVideoById = async (id) => {
    const video = await Video.findByPk(id);
    if (video) {
        return {
            success: true,
            data: video
        }
    } else {
        return {
            success: false,
            message: "Video is not found"
        }
    }
}

module.exports = {
  createVideo,
  findVideoById,
  updateVideo,
  deleteVideoById
};
