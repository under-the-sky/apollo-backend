import * as express from 'express';
import * as userController from '../controllers/userController';
import * as passportConfig from '../config/passport';
const router = express.Router();
router.post('/user', userController.createUser);
router.get('/user/:id',passportConfig.isAuthenticated, userController.getUserById);
router.get('/users', userController.getAlluser);
router.post('/signup', userController.signupWithPhone);
router.post('/login', userController.login);

export default router;