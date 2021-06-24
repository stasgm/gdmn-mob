// import Router from 'koa-router';
// import compose from 'koa-compose';
import Router from 'koa-joi-router';

import { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode } from '../controllers/auth';

import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { authValidation } from '../validations';

const router = Router();

router.prefix('/auth');
router.post('/signup', authValidation.signup, signUp);
router.post('/login', authValidation.login, logIn);
router.post('/logout', authMiddleware, logOut);
router.get('/user', authMiddleware, deviceMiddleware, getCurrentUser);
router.get('/device/:deviceId/code', authValidation.getActivationCode, getActivationCode);
router.post('/device/code', authValidation.verifyCode, verifyCode);

export default router;
