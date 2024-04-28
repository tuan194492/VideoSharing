const express = require("express");
const channelController = require("../controller/channelController");
const router = express.Router();

router.get('/:channelId', channelController.findChannelById);

module.exports = router;
