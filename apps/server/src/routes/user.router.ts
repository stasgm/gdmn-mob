import Router from 'koa-joi-router';

import compose from 'koa-compose';

import { addUser, getUsers, getUser, removeUser, updateUser } from '../controllers/user';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

import { userValidation } from '../validations';

const router = Router();

router.post('/', userValidation.addUser, authMiddleware, deviceMiddleware, addUser);
router.get('/:id', userValidation.getUser, authMiddleware, deviceMiddleware, getUser);
router.get('/', compose([authMiddleware, deviceMiddleware]), getUsers);
// router.get('/:id/devices', compose([authMiddleware, deviceMiddleware]), getDevicesByUser);
router.patch('/:id', userValidation.updateUser, authMiddleware, deviceMiddleware, updateUser);
router.delete('/:id', userValidation.removeUser, authMiddleware, deviceMiddleware, removeUser);

export default router;
