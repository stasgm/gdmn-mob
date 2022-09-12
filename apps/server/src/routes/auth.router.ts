// import Router from 'koa-router';
// import compose from 'koa-compose';
import router from 'koa-joi-router';

import { signup, logIn, logout, getCurrentUser, verifyCode, getDeviceStatus } from '../controllers/auth';

import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { authValidation } from '../validations';

const auth = router();

// deviceMiddleware - проверка в случае если пользователь заблокирован но залогинен
auth.prefix('/auth');
auth.post('/signup', authValidation.signup, signup);
auth.post('/login', authValidation.login, logIn); // Проверка устройства проводится в методе службе
auth.post('/logout', deviceMiddleware, logout);
auth.get('/user', authMiddleware, deviceMiddleware, getCurrentUser);
auth.post('/device/code', authValidation.verifyCode, verifyCode);
auth.get('/deviceStatus/:id', authValidation.getDeviceStatus, getDeviceStatus);

export default auth;
