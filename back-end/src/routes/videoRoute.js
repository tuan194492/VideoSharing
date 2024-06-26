const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');
const authMiddleware = require('../middlleware/authMiddleware');
const videoMiddleware = require('../middlleware/videoMiddleware');
/**
 * @swagger
 * /api/video:
 *   post:
 *     summary: Create a new video
 *     description: Create a new video
 *     consumes:
 *        - multipart/form-data
 *     requestBody:
 *      content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 format: binary
 *     responses:
 *          201:
 *              description: Success
 *          500:
 *              description: Internal Server error
 *
 *
 * */

router.get('/watch', videoController.getViewerVideoList);
router.get('/watched-video', authMiddleware.getUserToken, videoController.getWatchedVideoByUserId);
router.post('/watch-video/:id', authMiddleware.getUserToken, videoController.addWatchVideoEvent);
router.get('/recommend-video', authMiddleware.getUserToken, videoController.getRecommendVideo);

router.get('/trending-video', videoController.getTrendingVideos);
router.delete('/watched-video', authMiddleware.authenticateToken, videoController.deleteWatchedVideoByUserId);
router.get('/get-by-publisher/:publisherId', authMiddleware.getUserToken, videoController.getVideoByPublisherId);
router.get('/liked-video', authMiddleware.getUserToken, videoController.getLikedVideoByUser);
router.get('/similarUser/:userId', videoController.getSimilarUsers);
router.post('/search', videoController.searchVideos);
router.get('/stream-multi-res/:videoId', authMiddleware.getUserToken, videoController.streamMultipleResolutionsVideo);
router.get('/stream/:id', videoController.streamVideoById);
router.get('/data/:id', videoController.getVideoDataById);
router.get('/:id',  authMiddleware.getUserToken, videoController.getVideoById);
router.post('/', authMiddleware.authenticateToken, videoMiddleware.validateUpload, videoController.createVideo);
router.post('/:id', authMiddleware.authenticateToken, videoController.updateVideo);
// router.put('/:id', authMiddleware.authenticateToken ,videoController.updateVideo);
router.delete('/:id', authMiddleware.authenticateToken ,videoController.deleteVideo);

module.exports = router;
