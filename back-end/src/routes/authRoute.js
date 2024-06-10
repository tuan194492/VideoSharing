const express = require('express');
const router = express.Router();
const authController = require('../controller/authController')
const authMiddleware = require("../middlleware/authMiddleware");

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     description: Login
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: The user's email.
 *                              example: abc@gmail.com
 *                          password:
 *                              type: string
 *                              description: The user's password.
 *                              example: 123456
 *     responses:
 *          201:
 *              description: Success
 *          500:
 *              description: Internal Server error
 *
 * /api/auth/register:
 *   post:
 *     summary: Register
 *     description: Register
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: The user's email.
 *                              example: abc@gmail.com
 *                          password:
 *                              type: string
 *                              description: The user's password.
 *                              example: 123456
 *                          name:
 *                              type: string
 *                              description: The user's password.
 *                              example: 123456
 *                          shortname:
 *                              type: string
 *                              description: The user's password.
 *                              example: 123456
 *     responses:
 *          201:
 *              description: Success
 *          500:
 *              description: Internal Server error
*/
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/update', authMiddleware.authenticateToken  , authController.update);
router.get('/all-user', authMiddleware.authenticateAdmin, authController.getAllUsers);
router.post('/:userId/activate', authMiddleware.authenticateAdmin, authController.activateUser);
router.post('/:userId/suspend', authMiddleware.authenticateAdmin, authController.suspendUser);
module.exports = router;
