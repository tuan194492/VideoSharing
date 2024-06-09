const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlleware/authMiddleware");
const reportController = require("../controller/reportController");

router.post('/', authMiddleware.authenticateToken, reportController.createReport);
router.get('/user', authMiddleware.authenticateToken, reportController.getReportsByUser);
router.post('/:reportId/approve', authMiddleware.authenticateAdmin, reportController.approveReport);
router.post('/:reportId/reject', authMiddleware.authenticateAdmin, reportController.rejectReport);
router.get('/admin', authMiddleware.authenticateAdmin, reportController.getAllReportsForAdmin);

module.exports = router;
