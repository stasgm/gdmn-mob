import Router from 'koa-router';

import { getAllData } from '../controllers/test';

const router = new Router({ prefix: '/test' });

router.get('/all', getAllData);

export default router;
