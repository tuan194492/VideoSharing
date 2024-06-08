const express = require("express");

const notifyService = require("../service/notifyService");
const {NOTIFY_ACTION} = require("../constant/enum/ENUM")

const getNotificationList = async (req, res, next) => {
    const user = req.user;
    const result = await notifyService.getNotificationsByUser(req.user.userId, req.query?.page, req.query?.pageSize);
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

const unreadNotification = async (req, res, next) => {
  const notificationId = req.params.id;
  const result = await notifyService.markAsUnreadNotification(req.user.userId, notificationId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: "Unread notifications successful",
      data: result.data
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    })
  }
}

const readAllNotifications = async (req, res, next) => {
  const result = await notifyService.markAsReadAll(req.user.userId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: "Read all notifications successful",
      data: result.data
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    })
  }
}

const hasUnreadNotifications = async (req, res, next) => {
  const result = await notifyService.hasUnreadNotifications(req.user.userId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: "Has unread notifications",
      hasUnread: result.hasUnread
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
      hasUnread: false
    })
  }
}

module.exports = {
    getNotificationList,
    readNotification,
    hasUnreadNotifications,
    unreadNotification,
    readAllNotifications
}
