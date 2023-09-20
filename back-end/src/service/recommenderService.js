const express = require("express");
const Reaction = require("../model/Reaction");
const Video = require("../model/Video");
const User = require("../model/User");
const { Log } = require("../model/Log");
const { RecommendPoints } = require("../model/RecommendPoints");
const { WatchedVideo } = require("../model/WatchedVideo");
const videoService = require("./videoService");

const RANDOM_LARGE_NUMBER = 100;
let utilityMatrix, pointMatrix;
let users = [];
let videos = [];
let points = [];

const getRecommendVideoListByUser = async (userId) => {
	try {
		const values = await Promise.all([
			getPopularVideo(5),
			getRecommendVideoByUser(userId),
		]);
		console.log("VIDEOOOOOOOOOOOO", values);
		const popularVideos = values[0];
		const recommendVideos = values[1];
		return combinePopularWithRecommendVideo(popularVideos, recommendVideos);
	} catch (err) {
		console.log(err);
		return [];
	}
};

const getPopularVideo = async (numberOfVideo) => {
	const videos = await videoService.getMostWatchedVideos(numberOfVideo);
	return videos;
};

const getRecommendVideoByUser = async (userId) => {
	const similarUsers = await getSimilarUsers(parseInt(userId), 1);
	console.debug("🚀🚀🚀 ~ file: recommenderService.js:38 ~ getRecommendVideoByUser ~ Similar UserID:", userId)
	console.debug("🚀🚀🚀 ~ file: recommenderService.js:39 ~ getRecommendVideoByUser ~ similarUsers:", similarUsers)
	const recommendVideos = [];
	for (let user of similarUsers) {
		const interestedVideos = await getMostInterestedVideoByUser(user, 5);
		console.debug("🚀🚀🚀 ~ file: recommenderService.js:43 ~ getRecommendVideoByUser ~ user:", user)
		console.debug("🚀🚀🚀 ~ file: recommenderService.js:43 ~ getRecommendVideoByUser ~ interestedVideos:", interestedVideos)
		for (let video of interestedVideos) {
			if (!recommendVideos.includes(video)) {
				recommendVideos.push(video);
			}
		}
	}
	console.log("Recommend Video", recommendVideos);
	console.debug("🚀🚀🚀 ~ file: recommenderService.js:49 ~ getRecommendVideoByUser ~ recommendVideos:", recommendVideos)
	return recommendVideos;
};

const combinePopularWithRecommendVideo = (popularVideos, recommendVideos) => {
	const videos = [];
	for (let video of popularVideos) {
		if (!videos.includes(video)) {
			videos.push(video);
		}
	}
	for (let video of recommendVideos) {
		if (!videos.includes(video)) {
			videos.push(video);
		}
	}
	return videos;
};

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
		points = Array.from(Array(users.length), () =>
			new Array(videos.length).fill(0)
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
					if (points[i][k] && points[j][k]) {
						similarities.push(Math.abs(points[i][k] - points[j][k]));
					} else {
						similarities.push(RANDOM_LARGE_NUMBER);
					}
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

const getSimilarUsers = async (userId, numberOfUser) => {
	const similarities = await getUtilityMatrix();
	console.log("Users list", users, userId);
	if (users.includes(userId)) {
		console.log("Yes it included");
		const currentUserIndex = users.indexOf(userId);
		const similarVector = similarities[currentUserIndex];
		console.debug("🚀🚀🚀 ~ file: recommenderService.js:136 ~ getSimilarUsers ~ similarVector:", similarVector)
		const sortedArr = similarVector.slice(0);
		sortedArr.sort();
		console.debug("🚀🚀🚀 ~ file: recommenderService.js:130 ~ getSimilarUsers ~ numberOfUser:", numberOfUser)
		console.debug("🚀🚀🚀 ~ file: recommenderService.js:149 ~ returnsortedArr.slice ~ sortedArr.slice(1, 1 + parseInt(numberOfUser)):", sortedArr.slice(1, 1 + parseInt(numberOfUser)))
		return sortedArr.slice(1, 1 + parseInt(numberOfUser)).map((n) => {
			console.debug("🚀🚀🚀 ~ file: recommenderService.js:150 ~ returnsortedArr.slice ~ n:", n)
			console.debug("🚀🚀🚀 ~ file: recommenderService.js:148 ~ returnsortedArr.slice ~ similarVector.indexOf(n):", similarVector.indexOf(n))
			console.debug("🚀🚀🚀 ~ file: recommenderService.js:149 ~ returnsortedArr.slice ~ users:", users)
			console.debug("🚀🚀🚀 ~ file: recommenderService.js:150 ~ returnsortedArr.slice ~ similarVector:", similarVector)

			console.log(
				"Index ",
				similarVector.indexOf(n),
				users[similarVector.indexOf(n)]
			);
			return users[similarVector.indexOf(n)];
		});
	} else {
		return [];
	}
};

const getMostInterestedVideoByUser = async (userId, numberOfVideo) => {
	const interestedVideos = await RecommendPoints.find({
		userId: userId,
	})
		.sort({
			point: -1,
		})
		.limit(numberOfVideo);
	return interestedVideos.map((x) => x.videoId);
};

const resetMatrix = () => {
	console.debug("🚀🚀🚀 ~ file: recommenderService.js:161 ~ resetMatrix ~ Utility matrix Resetted")
	utilityMatrix = null;
	pointMatrix = [];
	users = [];
	videos = [];
	points = [];
};

module.exports = {
	getRecommendVideoListByUser,
	getSimilarUsers,
	resetMatrix,
	getRecommendVideoByUser,
};
