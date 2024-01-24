const express = require("express");
const router = express.Router();
const postsController = require("../controller/postController");
const verifyJWT = require("../middleware/verifyJWT");


/**
 * @swagger
 * components:
 *   schemas:
 *     Posts:
 *       type: object
 *       required:
 *         - username
 *         - title
 *         - description
 *         - type
 *         - spelling
 *       properties:
 *         username:
 *           type: string
 *           description: username
 *         title:
 *           type: string
 *           description: The post title
 *         description:
 *           type: string
 *           description: The post description
 *         type:
 *           type: string
 *           description: The post type
 *         spelling:
 *           type: string
 *           description: The work sepell
 *         image:
 *           type: string
 *           description: The post image
 *       example:
 *         username: john doe
 *         title: Cars
 *         description: The cars
 *         type: noun
 *         spelling: /car/
 */



/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: manager all posts
 */

router.use(verifyJWT);

router.route("/")
    /**
     * @swagger
     * /posts:
     *   get:
     *     summary: Returns cookies and access token
     *     tags: [Posts]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: return all posts
     *         content:
     *           application/json:
     *             schema:
     *              type: array
     *              items:
     *               $ref: '#/components/schemas/Posts'
     */
    .get(postsController.getAllPosts)
    .post(postsController.createNewPost)
    .patch(postsController.updatePost)
    .delete(postsController.deletePost)

module.exports = router;