import Router from 'koa-router';

import compose from 'koa-compose';

import { addUser, getUsers, getUser, removeUser, updateUser } from '../controllers/user';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/users' });

router.post('/', compose([authMiddleware, deviceMiddleware]), addUser);
router.get('/:id', compose([authMiddleware, deviceMiddleware]), getUser);
router.get('/', compose([authMiddleware, deviceMiddleware]), getUsers);
// router.get('/:id/devices', compose([authMiddleware, deviceMiddleware]), getDevicesByUser);
router.patch('/:id', compose([authMiddleware, deviceMiddleware]), updateUser);
router.delete('/:id', compose([authMiddleware, deviceMiddleware]), removeUser);

export default router;
