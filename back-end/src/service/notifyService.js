const express = require("express");
const Notification = require("../model/Notification");
const {NOTIFY_ACTION, NOTIFY_STATUS} = require("../constant/enum/ENUM")
const userService = require("../service/userService");
const videoService = require("../service/videoService");
const subcriberService = require("../service/subcriberService");
const io = require("../utils/socket/socket")
const Video = require("../model/Video");
const User = require("../model/User");

/*
    Notify template
 *  `ACTOR` has `action` + COMMENT `VIDEO`
 *                       + SUBCRIBE TO CHANNEL
 *                       + POSTED A VIDEO
 *                       + LIKE VIDEO
 *

 */

/* Params bao gom:
*    actor_id (ID Người gây ra hành động)
*    video_id (Đối với TH Comment hoặc like hoặc đăng)
*    notifier_id (Người nhận thông báo)
*
*/
const createNotifications = async (params, action) => {
    const {actorId, videoId, notifierId} = params;
    console.log(params)
    let notifierList = await getNotifierList(actorId, videoId, notifierId, action);
    console.log("Notifier List", notifierList)
    try {
        for (let notifier of notifierList) {
            console.log("Notifier id", notifier);
            const notificationData = {
                actor_id: actorId,
                notifer_id: notifier,
                video_id: videoId,
                status: NOTIFY_STATUS.UN_READ,
                type: action
            }
            Notification.create(notificationData)
            console.log(`user${notifier}`)
            io.emit(`user${notifier}`, notificationData);
        }
    } catch (e) {
        console.log(e);
    }
}

const getNotifierList = async (actorId, videoId, notifierId, action) => {
    switch (action) {
        case NOTIFY_ACTION.SUBCRIBE:
            return [notifierId];
        case NOTIFY_ACTION.REACT_LIKE:
        case NOTIFY_ACTION.REACT_DISLIKE:
        case NOTIFY_ACTION.COMMENT:
            const channelId = (await videoService.findVideoById(videoId)).data.publisher_id;
            console.log(channelId)
            return [channelId];
        case NOTIFY_ACTION.POST_VIDEO:
            const subcriberList = await subcriberService.getListOfSubcribersByChannelId(actorId);
            const subcribers = subcriberList.data.map(e => e.dataValues.subscriber_id)
            return subcribers;
        default:
            return [];
    }
}

const notifyToAllNotifiers = async (actor,  action) => {

}

const createParams = (action, actor) => {

}

const createNotifyTemplate = async (action, params) => {
    switch (action) {
        case NOTIFY_ACTION.POST_VIDEO:
            break;
        case NOTIFY_ACTION.COMMENT:
            break;
        case NOTIFY_ACTION.SUBCRIBE:
            break;
        default:
            break;
    }
}

const sendNotifies = async (notifierList) => {

}

const getNotificationsByUser = async (userId, page, pageSize) => {
    console.log(userId)
    if (!page) {
      page = 1
    }
    if (!pageSize) {
      pageSize = 10
    }
    try {
        const notifications = await Notification.findAll({
            where: {
                notifer_id: userId
            },
            order: [['createdAt', 'DESC']],
            include: [
              {
                model: User,
                as: 'Actor',
                attributes: ["id", "name", "avatar", "shortname", "subscriberCount"],
                required: true
              },
              {
                model: Video,
                as: 'Video',
                attributes: ["id", "title", "description", "views", "createdAt", 'thumbnail'],
                required: false
              }
            ],
            limit: parseInt(pageSize),
            offset: (parseInt(page) - 1) * parseInt(pageSize)
        })
        return {
            success: true,
            data: notifications,
            message: "Get notification successful"
        }
    } catch (e) {
      console.log(e)
        return {
            success: false,
            data: [],
            message: "No notifications"
        }
    }
}

const readNotification = async (userId, notificationId) => {
    try {
        const notification = await Notification.findByPk(notificationId);
        if (notification && notification.notifer_id == userId) {
            notification.status = NOTIFY_STATUS.READ;
            await notification.save();
            return {
                success: true,
                message: "Read notification successful"
            }
        } else {
            return {
                success: false,
                message: "Some things happen!"
            }
        }

    } catch (e) {
        return {
            success: false,
            data: [],
            message: "No notification"
        }
    }
}

const markAsUnreadNotification = async (userId, notificationId) => {
  try {
    const notification = await Notification.findByPk(notificationId);
    if (notification && notification.notifer_id == userId) {
      notification.status = NOTIFY_STATUS.UN_READ;
      await notification.save();
      return {
        success: true,
        message: "Mark as unread notification successful"
      }
    } else {
      return {
        success: false,
        message: "Some things happen!"
      }
    }

  } catch (e) {
    return {
      success: false,
      data: [],
      message: "No notification"
    }
  }
}

const markAsReadAll = async (userId) => {
  try {
    const notifications = await Notification.update(
      {
        status: NOTIFY_STATUS.READ
      },
      {
        where: {
          notifer_id: userId
        }
      }
    )
    return {
      success: true,
      message: "Mark as read notification successful"
    }

  } catch (e) {
    return {
      success: false,
      data: [],
      message: "No notification"
    }
  }
}

const hasUnreadNotifications = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        notifer_id: userId,
        status: NOTIFY_STATUS.UN_READ
      }
    })
    return {
      success: true,
      hasUnread: notifications.length > 0
    }
  } catch (e) {
    return false
  }
}

module.exports = {
    notifyToAllNotifiers,
    createNotifications,
    getNotificationsByUser,
    readNotification,
    markAsUnreadNotification,
    markAsReadAll,
    hasUnreadNotifications
}
