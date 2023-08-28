const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');
const authMiddleware = require('../middlleware/authMiddleware');

router.get('/data/:id', videoController.getVideoDataById);
router.get('/:id', authMiddleware.authenticateToken ,videoController.getVideoById);
router.post('/', authMiddleware.authenticateToken ,videoController.createVideo);
router.put('/:id', authMiddleware.authenticateToken ,videoController.updateVideo);
router.delete('/:id', authMiddleware.authenticateToken ,videoController.deleteVideo);

module.exports = router;