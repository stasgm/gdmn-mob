import Router from 'express';

import { checkRequireAuth, loginController } from '../controllers/AuthController';

import { requireAuth } from '../middlewares/requireAuth';

const router = Router();

router.get('/', requireAuth, checkRequireAuth);

router.post('/login', loginController);

/*router.post('/logout', requireAuth, logoutController);*/

export default router;
