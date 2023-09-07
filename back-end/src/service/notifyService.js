const express = require("express");
const Notification = require("../model/Notification");
const {NOTIFY_ACTION, NOTIFY_STATUS} = require("../constant/enum/ENUM")
const userService = require("../service/userService");
const videoService = require("../service/videoService");
const subcriberService = require("../service/subcriberService");

/*
    Notify template
 *  `ACTOR` has `action` + COMMENT `VIDEO`
 *                       + SUBCRIBE TO CHANNEL       
 *                       + POSTED A VIDEO
 *                       + LIKE VIDEO
 * 

 */

    /*
    const Notification = sequelize.define('Notification', {
        actor_id: DataTypes.INTEGER,
        notifer_id: DataTypes.INTEGER,
        video_id: DataTypes.INTEGER,
        status: DataTypes.CHAR,
        type: DataTypes.STRING,
        created_at: DataTypes.DATE,
  });
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
    try {
        for (let notifier of notifierList) {
            Notification.create({
                actor_id: actorId,
                notifer_id: notifier,
                video_id: videoId,
                status: NOTIFY_STATUS.UN_READ,
                type: action
            })
        }
    } catch (e) {
        console.log(e);
    }
}

const getNotifierList = async (actorId, videoId, notifierId, action) => {
    switch (action) {
        case NOTIFY_ACTION.SUBCRIBE:
            return [notifierId];
        case NOTIFY_ACTION.COMMENT:
            const channelId = await videoService.findVideoById(videoId).data;
            return [channelId];
        case NOTIFY_ACTION.POST_VIDEO:
            const subcriberList = await subcriberService.getListOfSubcribersByChannelId(actorId).data;
            return subcriberList;
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

module.exports = {
    notifyToAllNotifiers,
    createNotifications
}