const express = require("express");
const channelController = require("../controller/channelController");
const router = express.Router();

router.get('/view-analytic/:channelId', channelController.getChannelViewAnalyst);
router.get('/search', channelController.searchChannel);
router.get('/channel-analytic/:channelId', channelController.getChannelAnalytics);
router.get('/subscriber-analytic/:channelId', channelController.getChannelSubscriberAnalyst);
router.get('/most-watched-video/:channelId', channelController.getMostWatchedVideos);
router.get('/:channelId', channelController.findChannelById);
router.post('/delete-watched-videos/:logId', channelController.deleteWatchedVideo);

module.exports = router;
