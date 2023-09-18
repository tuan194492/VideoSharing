const express = require("express");
const Reaction = require("../model/Reaction");
const Video = require("../model/Video");
const User = require("../model/User");
const Log = require("../model/Log");
const RecommendPoints = require("../model/");
let utilityMatrix;

const getRecommendVideoListByUser = (userId) => {
	Promise.all(getPopularVideo(5), getRecommendVideoByUser)
		.then((values) => {
			const popularVideos = values[0];
			const recommendVideos = values[1];
			return combinePopularWithRecommendVideo(
				popularVideos,
				recommendVideos
			);
		})
		.catch((err) => {
			console.log(err);
			return [];
		});
};

const getPopularVideo = async (numberOfVideo) => {};

const getRecommendVideoByUser = async (userId) => {};

const combinePopularWithRecommendVideo = (popularVideos, recommendVideos) => {};

const getUtilityMatrix = async () => {
	if (!utilityMatrix) {
		const recommendPoints = await RecommendPoints.find({});
		const users = [];
		const videos = [];
		const points = [];
		recommendPoints.forEach((data) => {
			const user = data.userId;
			const video = data.videoId;
			const point = data.point;
            if (!users.includes(user)) {
                users.push(user);
            }
            if (!videos.includes(video)) {
                videos.push(video);
            }
            points.push([users.indexOf(user), videos.indexOf(video), point]);
		});

        utilityMatrix = [];

        for (let i = 0; i < users.length; i++) {
            const row = [];
            for (let j = 0; j < users.length; j++) {
              const similarities = [];
              for (let k = 0; k < videos.length; k++) {
                if (points[i][k] && points[j][k]) {
                  similarities.push(points[i][k] - points[j][k]);
                }
              }
              if (similarities.length > 0) {
                const similarity = similarities.reduce((acc, cur) => acc + cur) / similarities.length;
                row.push(similarity);
              } else {
                row.push(0);
              }
            }
            utilityMatrix.push(row);
          }
          console.log(utilityMatrix);
	}
	return utilityMatrix;
};

module.exports = {
	getRecommendVideoListByUser,
};
