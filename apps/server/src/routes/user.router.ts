import Router from 'koa-joi-router';

import { addUser, getUsers, getUser, removeUser, updateUser } from '../controllers/user';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

import { userValidation } from '../validations';

const router = Router();

router.prefix('/users');
router.post('/', userValidation.addUser, authMiddleware, deviceMiddleware, addUser);
router.get('/:id', userValidation.getUser, authMiddleware, deviceMiddleware, getUser);
router.get('/', authMiddleware, deviceMiddleware, getUsers);
// router.get('/:id/devices', compose([authMiddleware, deviceMiddleware]), getDevicesByUser);
router.patch('/:id', userValidation.updateUser, authMiddleware, deviceMiddleware, updateUser);
router.delete('/:id', userValidation.removeUser, authMiddleware, deviceMiddleware, removeUser);

export default router;
