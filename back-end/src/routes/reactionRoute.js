const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlleware/authMiddleware');
const reactionController = require("../controller/reactionController");

router.get('/react-to-video/:videoId', authMiddleware.authenticateToken, reactionController.getReactStatusToVideo);
router.post('/like-video/:videoId', authMiddleware.authenticateToken, reactionController.likeVideo);
router.post('/dislike-video/:videoId', authMiddleware.authenticateToken, reactionController.dislikeVideo);
router.post('/undo-like-video/:videoId', authMiddleware.authenticateToken, reactionController.likeVideo);
router.post('/undo-dislike-video/:videoId', authMiddleware.authenticateToken, reactionController.dislikeVideo);

module.exports = router;
