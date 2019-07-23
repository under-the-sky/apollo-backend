import * as express from 'express';
import * as userController from '../controllers/userController';


const router = express.Router();

/**
  * @swagger
  * tags:
  *   - name: user
  *     description: just for user
  */

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - user
 *     summary: POST user
 *     description: create user POST 
 *     responses:
 *       200:
 *         description: 【success】 return 200
 */
router.post('/user', userController.createUser);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     tags:
 *       - user
 *     summary: GET user
 *     description: search user
 *     responses:
 *       200:
 *         description: 【success】 return 200
 */
router.get('/user/:id', userController.getUserById);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - user
 *     summary: GET users
 *     description: filter users
 *     responses:
 *       200:
 *         description: 【success】 return 200
 */
router.get('/users', userController.getAlluser);

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *       - user
 *     summary: POST signup
 *     description: user signup
 *     responses:
 *       200:
 *         description: 【success】 return 200
 */
router.post('/signup', userController.postSignup);

export default router;