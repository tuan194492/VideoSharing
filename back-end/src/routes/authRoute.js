const express = require('express');
const router = express.Router();
const authController = require('../controller/authController')

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
 * 
*/
router.post('/login', authController.login);

router.post('/register', authController.register);

module.exports = router;