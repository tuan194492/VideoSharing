const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlleware/authMiddleware');
const notifyController = require("../controller/notifyController");

router.get('/', authMiddleware.authenticateToken, notifyController.getNotificationList);
router.post('/:id', authMiddleware.authenticateToken, notifyController.readNotification);

module.exports = router;
