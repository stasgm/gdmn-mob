import Router from 'koa-router';
import { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode } from '../controllers/auth';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import compose from 'koa-compose';

const router = new Router({ prefix: '/auth' });

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/logout', authMiddleware, logOut);
router.get('/user', compose([authMiddleware, deviceMiddleware]), getCurrentUser);
router.get('/device/:deviceId/code', getActivationCode);
router.post('/device/code', verifyCode);

export default router;
