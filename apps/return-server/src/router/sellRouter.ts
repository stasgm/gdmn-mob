import Router from 'express';

import { findAll } from '../controllers/sellController';

const router = Router();

router.get('/sellbills', findAll);

export default router;
