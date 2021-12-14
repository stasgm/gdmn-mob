// import Router from 'koa-router';
// import compose from 'koa-compose';
import Router from 'koa-joi-router';

import { signup, logIn, logout, getCurrentUser, verifyCode, getDeviceStatus } from '../controllers/auth';

import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { authValidation } from '../validations';

const router = Router();

// deviceMiddleware - проверка в случае если пользователь заблокирован но залогинен
router.prefix('/auth');
router.post('/signup', authValidation.signup, signup);
router.post('/login', authValidation.login, logIn); // Проверка устройства проводится в методе службе
router.post('/logout', authMiddleware, deviceMiddleware, logout);
router.get('/user', authMiddleware, deviceMiddleware, getCurrentUser);
router.post('/device/code', authValidation.verifyCode, verifyCode);
router.get('/deviceStatus/:id', authValidation.getDeviceStatus, getDeviceStatus);

export default router;
