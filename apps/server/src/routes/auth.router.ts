import Router from 'koa-router';

import compose from 'koa-compose';

import { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode } from '../controllers/auth';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/auth' });

router.post('/signup', signUp);
router.post('/login', logIn); // В методе logIn идёт проверка связи устройства с пользователем
router.get('/logout', authMiddleware, logOut);
router.get('/user', compose([authMiddleware, deviceMiddleware]), getCurrentUser);
router.get('/device/:deviceId/code', getActivationCode);
router.post('/device/code', verifyCode);

export default router;
