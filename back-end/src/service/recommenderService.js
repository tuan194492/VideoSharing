const express = require("express");
const Reaction = require("../model/Reaction");
const Video = require("../model/Video");
const User = require("../model/User");
const Log = require("../model/Log");

const getRecommendVideoListByUser = (userId) => {
    Promise
        .all(getPopularVideo(5), getRecommendVideoByUser)
        .then(values => {
            const popularVideos = values[0];
            const recommendVideos = values[1];
            return combinePopularWithRecommendVideo(popularVideos, recommendVideos);
        })
        .catch(err => {
            console.log(err);
            return [];
        })
}

const getPopularVideo = async (numberOfVideo) => {
    
}

const getRecommendVideoByUser = async (userId) => {

}

const combinePopularWithRecommendVideo = (popularVideos, recommendVideos) => {

}

module.exports = {
    getRecommendVideoListByUser
}