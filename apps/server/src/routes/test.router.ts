import router from 'koa-joi-router';

import { testServerConnection } from '../controllers/test';

const test = router();

test.prefix('/test');

test.get('/', testServerConnection);

export default test;
