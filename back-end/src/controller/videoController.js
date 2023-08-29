const express = require('express');
const videoService = require("../service/videoService");
const notifyService = require("../service/notifyService");

const getVideoDataById = async (req, res, next) => {

}

const createVideo = async (req, res, next) => {
    const file = req.files.file;
    const meta = req.body;
    console.log(req.user);
    const result = await videoService.createVideo(meta, file, req.user);
    if (result.success) {
        notifyService.notifyToAllNotifiers();
        return res.status(201).json({
            message: "Upload video successful"
        })
    } else {
        return res.status(500).json({
            message: result.message
        })
    }
}

const updateVideo = async (req, res, next) => {

}

const deleteVideo = async (req, res, next) => {

}

const getVideoById = async (req, res, next) => {

}

module.exports = {
    createVideo,
    updateVideo,
    deleteVideo,
    getVideoById,
    getVideoDataById
}



