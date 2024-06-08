const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlleware/authMiddleware');
const notifyController = require("../controller/notifyController");

router.get('/', authMiddleware.authenticateToken, notifyController.getNotificationList);
router.get('/has-unread-notification', authMiddleware.authenticateToken, notifyController.hasUnreadNotifications);
router.post('/read-all', authMiddleware.authenticateToken, notifyController.readAllNotifications);
router.post('/read/:id', authMiddleware.authenticateToken, notifyController.readNotification);
router.post('/un-read/:id', authMiddleware.authenticateToken, notifyController.unreadNotification);

module.exports = router;
