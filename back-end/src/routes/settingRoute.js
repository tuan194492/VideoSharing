const express = require('express');
const router = express.Router();
const settingController = require('../controller/settingController');
const authMiddle = require('../middlleware/authMiddleware');

// GET settings
router.get('/', authMiddle.authenticateAdmin, settingController.getSettings);
router.get('/dashboard', authMiddle.authenticateAdmin, settingController.getAdminDashBoard);
// PUT update settings
router.put('/', authMiddle.authenticateAdmin, settingController.updateSettings);

module.exports = router;
