const express = require('express')
const router = express.Router()
const authController = require("../controller/authController.js");
const loginLimiter = require("../middleware/loginLimiter.js");

 /**
 * @swagger
 * tags:
 *   name: Authentic
 *   description: login, refresh session, logout...
 */

 /**
 * @swagger
 * /auth:
 *   post:
 *     summary: Returns cookies and access token
 *     tags: [Authentic]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                      description: username
 *                  password: 
 *                      type: string
 *     responses:
 *       200:
 *         description: JWT Accesstoken
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                  accessToken:
 *                      type: string
 *                      description: use to access store
 */
router.route("/")
    .post(loginLimiter, authController.login);

router.route('/refresh')
    .get(authController.refresh);

router.route("/logout")
    .post(authController.logout);

module.exports = router;