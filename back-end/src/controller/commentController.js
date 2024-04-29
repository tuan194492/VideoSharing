const express = require("express");

const videoService = require("../service/videoService");
const commentService = require("../service/commentService");
const userService = require("../service/userService");
const notifyService = require("../service/notifyService");
const { NOTIFY_ACTION, USER_ACTION } = require("../constant/enum/ENUM");
const loggingService = require("../service/loggingService");

const getCommentsByVideo = async (req, res, next) => {
	const id = req.params.videoId;
	const result = await videoService.findVideoById(id);
	if (result.success) {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const getCommentsResult = await commentService.getCommentByVideo(
			id,
			page,
			pageSize
		);
		console.log("🚀 ~ file: commentController.js:20 ~ getCommentsByVideo ~ getCommentsResult:", getCommentsResult)
		const comments = [];
		for (let comment of getCommentsResult.data.rows) {
			const data = await userService.getUserById(comment.user_id);
      const user = data.success ? data.user : null;

      comments.push({
				...comment.dataValues,
				username: user?.name || "No name",
        postedSince: ((new Date()).getTime() - comment.createdAt) / 1000
      })
		}
		if (getCommentsResult.success) {
			return res.status(200).json({
				success: true,
				data: {
					rows: comments.length,
					data: comments
				},
				message: "Get Comment list successful",
			});
		} else {
			return res.status(400).json({
				success: false,
				message: getCommentsResult.message,
			});
		}
	} else {
		return res.status(400).json({
			success: false,
			message: result.message,
		});
	}
};

const addComment = async (req, res, next) => {
	const videoId = req.params.videoId;
	console.log(req.user);
	const result = await commentService.addComment(
		req.body.comment,
		req.user,
		videoId
	);
	if (result.success) {
		const params = {
			actorId: req.user.userId,
			videoId: videoId,
			notifierId: 0,
		};
		notifyService.createNotifications(params, NOTIFY_ACTION.COMMENT);
		loggingService.createLog({
			userId: req.user.userId,
			action: USER_ACTION.COMMENT,
			videoId: videoId,
		});
		return res.status(200).json({
			success: true,
			message: result.message,
		});
	} else {
		return res.status(400).json({
			success: false,
			message: result.message,
		});
	}
};

const deleteComment = async (req, res, next) => {
	const id = req.params.commentId;
	const comment = await commentService.findCommentById(id);
	if (comment) {
		console.log(comment);
		if (comment.user_id != req.user.userId) {
			return res.status(403).json({
				success: false,
				message: "Only own use can delete this comment",
			});
		}
	} else {
		return res.status(400).json({
			success: false,
			message: "Comment not found",
		});
	}
	const result = await commentService.deleteComment(id);
	if (result.success) {
		return res.status(200).json({
			success: true,
			message: result.message,
		});
	} else {
		return res.status(400).json({
			success: false,
			message: result.message,
		});
	}
};

module.exports = {
	getCommentsByVideo,
	addComment,
	deleteComment,
};
