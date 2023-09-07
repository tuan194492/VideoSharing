const express = require("express");

const subcriberService = require("../service/subcriberService");
const notifyService = require("../service/notifyService");
const {NOTIFY_ACTION} = require("../constant/enum/ENUM")

const subcribeToChannel = async (req, res, next) => {
    const user = req.user;
    const subcribeResult = await subcriberService.subcribeToUser(user.userId, req.body.channelId);
    if (subcribeResult.success) {
        const params = {
            actorId: req.user.userId,
            videoId: 0,
            notifierId: req.body.channelId
        };
        notifyService.createNotifications(params, NOTIFY_ACTION.SUBCRIBE);
        return res.status(200).json({
            success: true,
            message: "Subcribe successful"
        });
    } else {
        return res.status(400).json({
            success: false,
            message: subcribeResult.message
        }) 
    }
}

const unsubcribeToChannel = async (req, res, next) => {
    const user = req.user;
    const subcribeResult = await subcriberService.unsubcribeToUser(user.userId, req.body.channelId);
    if (subcribeResult.success) {
        return res.status(200).json({
            success: true,
            message: "Unsubcribe successful"
        });
    } else {
        return res.status(400).json({
            success: false,
            message: subcribeResult.message
        }) 
    }
}

const getChannelSubcribers = async (req, res, next) => {
    const channelId = req.params.channelId;
    console.log(channelId)
    const subcribeResult = await subcriberService.getListOfSubcribersByChannelId(channelId);
    if (subcribeResult.success) {
        return res.status(200).json({
            success: true,
            message: "Get sucrbier list successful",
            data: subcribeResult.data
        });
    } else {
        return res.status(400).json({
            success: false,
            message: subcribeResult.message,
            data: subcribeResult.data
        }) 
    }
}

const getChannelSubcribeTo = async (req, res, next) => {
    const userId = req.user.userId;
    const subcribeResult = await subcriberService.getListOfSubcribedChannel(userId);
    if (subcribeResult.success) {
        return res.status(200).json({
            success: true,
            message: "Get list of subcribe channel successful",
            data: subcribeResult.data
        });
    } else {
        return res.status(400).json({
            success: false,
            message: subcribeResult.message,
            data: subcribeResult.data
        }) 
    }
}

module.exports = {
    subcribeToChannel,
    unsubcribeToChannel,
    getChannelSubcribers,
    getChannelSubcribeTo
}