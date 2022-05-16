import { Router } from 'express';

import { checkRequireAuth, loginController, logoutController } from './controllers/AuthController';

import { requireAuth } from './middlewares/requireAuth';

import { findAll } from './controllers/sellController';

const router = Router();

router.get('/', requireAuth, checkRequireAuth);

router.post('/login', loginController);

router.post('/logout', requireAuth, logoutController);

router.get('/sellbills', requireAuth, findAll);

export default router;
