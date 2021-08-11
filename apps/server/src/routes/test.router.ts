import Router from 'koa-joi-router';

import { testServerConnection } from '../controllers/test';

const router = Router();

router.prefix('/test');

router.get('/', testServerConnection);

export default router;
