const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlleware/authMiddleware');
const playlistController = require("../controller/playlistController");

router.get('/detail/:playlistId', authMiddleware.getUserToken, playlistController.getPlaylistDetail);
router.get('/public/:channelId', authMiddleware.getUserToken, playlistController.getPublicPlaylistListOfChannel);
router.get('/all/:channelId', authMiddleware.authenticateToken, playlistController.getAllPlaylistListOfChannel);
router.post('/create-playlist', authMiddleware.authenticateToken, playlistController.createPlaylist);
router.post('/delete-playlist/:playlistId', authMiddleware.authenticateToken, playlistController.deletePlaylist);
router.post('/add-video-to-playlist', authMiddleware.authenticateToken, playlistController.addVideoToPlaylist);
router.post('/remove-video-from-playlist', authMiddleware.authenticateToken, playlistController.removeVideoFromPlaylist);

module.exports = router;
