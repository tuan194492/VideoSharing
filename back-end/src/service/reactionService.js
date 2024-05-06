const express = require("express");
const Reaction = require("../model/Reaction");
const Video = require("../model/Video");
const User = require("../model/User");

const { REACTION_TYPE } = require("../constant/enum/ENUM");

const getLikeCountOfVideo = async (videoId) => {

}

const getDislikeCountOfVideo = async (videoId) => {

}

const likeVideo = async (userId, videoId) => {
    try {
        const user = await User.findByPk(userId);
        const video = await Video.findByPk(videoId);
        if (!user || !video) {
            return {
                success: false,
                message: "User or video not found"
            }
        }
        const reaction = await Reaction.findOne({
            where: {
                user_id: userId,
                video_id: videoId,
            }
        })
        if (reaction) {
            return {
                success: false,
                message: "Already Reacted"
            }
        } else {
            await Reaction.create({
                user_id: userId,
                video_id: videoId,
                type: REACTION_TYPE.LIKE
            })
            return {
                success: true,
                message: "Liked video successful"
            }
        }
    } catch (err) {
        return {
            success: false,
            message: err
        }
    }
}

const dislikeVideo = async (userId, videoId) => {
    try {
        const user = await User.findByPk(userId);
        const video = await Video.findByPk(videoId);
        if (!user || !video) {
            return {
                success: false,
                message: "User or video not found"
            }
        }
        
        const reaction = await Reaction.findOne({
            where: {
                user_id: userId,
                video_id: videoId,
            }
        })
        if (reaction) {
            return {
                success: false,
                message: "Already Reacted"
            }
        } else {
            await Reaction.create({
                user_id: userId,
                video_id: videoId,
                type: REACTION_TYPE.DISLIKE
            })
            return {
                success: true,
                message: "Disliked video successful"
            }
        }
    } catch (err) {
        return {
            success: false,
            message: err
        }
    }
}

const getUserReactionToVideo = async (userId, videoId) => {
    try {
        const user = await User.findByPk(userId);
        const video = await Video.findByPk(videoId);
        if (!user || !video) {
            return {
                success: false,
                message: "User or video not found"
            }
        }
        const reaction = await Reaction.findOne({
            where: {
                user_id: userId,
                video_id: videoId
            }
        })

        if (reaction == null) {
            return {
                success: true,
                isLiked: false,
                isDisliked: false,
                message: 'Get data successful'
            }
        }

        return {
            success: true,
            isLiked: reaction.type === REACTION_TYPE.LIKE,
            isDisliked: reaction.type === REACTION_TYPE.DISLIKE,
            message: 'Get data successful'
        }

    } catch (err) {
        return {
            success: false,
            isLiked: false,
            message: err
        }
    }
}


module.exports = {
    getLikeCountOfVideo,
    getDislikeCountOfVideo,
    likeVideo,
    dislikeVideo,
    getUserReactionToVideo
}