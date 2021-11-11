import Router from 'express';

import { findAll } from '../controllers/sellController';

import { requireAuth } from '../middlewares/requireAuth';

const router = Router();

router.get('/sellbills', requireAuth, findAll);

export default router;
