const express = require("express");
const Reaction = require("../model/Reaction");
const Video = require("../model/Video");
const User = require("../model/User");
const { Log } = require("../model/Log");
const { RecommendPoints } = require("../model/RecommendPoints");

let utilityMatrix, pointMatrix;
let users = [];
let videos = [];
let points = [];

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
		const recommendPoints = await RecommendPoints.find();
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
		points = Array.from(
			Array(users.length),
			() => new Array(videos.length)
		);
		recommendPoints.forEach((data) => {
			const user = data.userId;
			const video = data.videoId;
			const point = data.point;
			points[users.indexOf(user)][videos.indexOf(video)] = point;
		});
		pointMatrix = points;

		console.log("=============================");
		console.log(points);
		console.log("=============================");

		utilityMatrix = [];

		for (let i = 0; i < users.length; i++) {
			const row = [];
			for (let j = 0; j < users.length; j++) {
				const similarities = [];
				for (let k = 0; k < videos.length; k++) {
					console.log("=============================");
					console.log(points[i][k], points[j][k]);
					console.log("=============================");
					similarities.push(Math.abs(points[i][k] - points[j][k]));
				}
				if (similarities.length > 0) {
					const similarity =
						similarities.reduce((acc, cur) => acc + cur) /
						similarities.length;
					row.push(similarity);
				} else {
					row.push(0);
				}
			}
			utilityMatrix.push(row);
		}
		console.log("Done CREATE MATRIX");
		console.log(utilityMatrix);
		console.log("Done CREATE MATRIX");
	}
	return utilityMatrix;
};

const getSimilarUsers = async (userId) => {
	const similarities = await getUtilityMatrix();
	if (users.includes(userId)) {
		const currentUserIndex = users.indexOf(userId);
		console.log(similarities);
	} else {
		return null;
	}
};

const resetMatrix = () => {
	utilityMatrix = [];
	pointMatrix = [];
	users = [];
	videos = [];
	points = [];
};

module.exports = {
	getRecommendVideoListByUser,
	getSimilarUsers,
	resetMatrix
};
