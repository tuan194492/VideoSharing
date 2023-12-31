const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlleware/authMiddleware');
const reactionController = require("../controller/reactionController");

router.post('/like/:videoId', authMiddleware.authenticateToken, reactionController.likeVideo);
router.post('/dislike/:videoId', authMiddleware.authenticateToken, reactionController.dislikeVideo); 

module.exports = router;
