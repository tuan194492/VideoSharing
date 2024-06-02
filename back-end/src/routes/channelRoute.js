const express = require("express");
const channelController = require("../controller/channelController");
const router = express.Router();

router.get('/view-analytic/:channelId', channelController.getChannelViewAnalyst);
router.get('/:channelId', channelController.findChannelById);

module.exports = router;
