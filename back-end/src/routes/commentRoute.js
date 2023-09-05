const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');
const authMiddleware = require('../middlleware/authMiddleware');

router.get('/:videoId', commentController.getCommentsByVideo);
router.post('/:videoId', authMiddleware.authenticateToken, commentController.addComment);
router.delete('/:commentId', authMiddleware.authenticateToken, commentController.deleteComment);

module.exports = router;
