const express = require('express');
const router = express.Router();
const subcriberController = require('../controller/subcribeController');
const authMiddleware = require('../middlleware/authMiddleware');

router.get('/subcriber/:channelId', subcriberController.getChannelSubcribers);
router.get('/is_subscribed/:channelId', authMiddleware.authenticateToken, subcriberController.isSubscribedToChannel);
router.get('/subcribe-to', authMiddleware.authenticateToken, subcriberController.getChannelSubcribeTo);
router.post('/subcribe', authMiddleware.authenticateToken, subcriberController.subcribeToChannel);
router.post('/unsubcribe', authMiddleware.authenticateToken, subcriberController.unsubcribeToChannel);


module.exports = router;
