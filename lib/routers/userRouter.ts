import * as express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/user', userController.createUser);
router.get('/user/:id', userController.getUserById);
router.get('/users', userController.getAlluser);
router.post('/signup', userController.postSignup);

export default router;