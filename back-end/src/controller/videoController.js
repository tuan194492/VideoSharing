const express = require('express');
const fs = require('fs');
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
    const id = req.query.id;
    const result = await videoService.findVideoById(id);
    if (result.success) {
        return res.status(200).json({
            success: true,
            data: result.data
        });
    } else {
        return res.status(400).json({
            success: false,
            message: result.message
        })
    }
}

const streamVideoById = async (req, res, next) => {
    const id = req.params.id;
    console.log(id)
    const videoPathResult = await videoService.findVideoById(id);
    if (!videoPathResult.success) {
        return res.status(404).json({
            success: false,
            message: "Can't not find video"
        })
    }
    const range = req.headers.range;
    if (!range) {
        return res.status(400).send("Requires Range header");
    }
    const videoPath = 'public/' + videoPathResult.data.url; // back-end\public\1\sample.mp4
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
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
}

module.exports = {
    createVideo,
    updateVideo,
    deleteVideo,
    getVideoById,
    getVideoDataById,
    streamVideoById
}



