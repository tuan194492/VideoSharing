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

const getViewerVideoList = async (data) => {
  
  try {
    console.log(data)
    const page = parseInt(data.page) || 1;
    const pageSize = parseInt(data.pageSize) || 10;
    const result = await Video.findAndCountAll({
      limit: pageSize,
      offset: page - 1,
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

const updateVideo = async (videoData, id) => {
  try {
    const video = await Video.findByPk(id);
    if (video) {
      console.log(video)
        const {title, description} = videoData;
        video.title = title;
        video.description = description;
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
  } catch (e) {
    return {
      success: false,
      message: e
  }
  }
  
};

const deleteVideoById = async (id) => {
  try {
    let video = await Video.findByPk(id);
    console.log(video.dataValues.id);
    if (video) {
      console.log("ABC DEF")
        video.status = VIDEO_STATUS.DELETED;
        await video.save(); // Soft delete
        return {
            success: true,
            data: video.dataValues,
            message: "Delete Video successful"
        }
    } else {
        return {
            success: false,
            message: "Video is not found"
        }
    }
  } catch (e) {
    return {
      success: false,
      message: e
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
            data: video.dataValues
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
  deleteVideoById,
  getViewerVideoList
};
