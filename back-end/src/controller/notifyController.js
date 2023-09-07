const express = require("express");

const notifyService = require("../service/notifyService");
const {NOTIFY_ACTION} = require("../constant/enum/ENUM")

const getNotificationList = async (req, res, next) => {
    const user = req.user;
    const result = await notifyService.getNotificationsByUser(req.user.userId);
    if (result.success) {
        return res.status(200).json({
            success: true,
            message: "Get notifications successful",
            data: result.data
        });
    } else {
        return res.status(400).json({
            success: false,
            message: result.message
        }) 
    }
}

const readNotification = async (req, res, next) => {
    const notificationId = req.params.id;
    const result = await notifyService.readNotification(req.user.userId, notificationId);
    if (result.success) {
        return res.status(200).json({
            success: true,
            message: "Get notifications successful",
            data: result.data
        });
    } else {
        return res.status(400).json({
            success: false,
            message: result.message
        }) 
    }   
}

module.exports = {
    getNotificationList,
    readNotification
}