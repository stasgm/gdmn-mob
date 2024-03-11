import router from 'koa-joi-router';

import {
  signup,
  logIn,
  logout,
  getCurrentUser,
  verifyCode,
  getDeviceStatus,
  checkAccessCode,
} from '../controllers/auth';

import { authMiddleware, deviceMiddleware, adminMiddleware } from '../middleware';
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
auth.post(
  '/checkAccessCode',
  authValidation.checkAccessCode,
  authMiddleware,
  deviceMiddleware,
  adminMiddleware,
  checkAccessCode,
);

export default auth;
