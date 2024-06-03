const express = require("express");
const channelController = require("../controller/channelController");
const router = express.Router();

router.get('/view-analytic/:channelId', channelController.getChannelViewAnalyst);
router.get('/subscriber-analytic/:channelId', channelController.getChannelSubscriberAnalyst);
router.get('/most-watched-video/:channelId', channelController.getMostWatchedVideos);

router.get('/:channelId', channelController.findChannelById);

module.exports = router;
