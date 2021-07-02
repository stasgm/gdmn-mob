import Router from 'koa-joi-router';

import { addUser, getUsers, getUser, removeUser, updateUser } from '../controllers/user';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';

import { userValidation } from '../validations';

const router = Router();

router.prefix('/users');
router.post('/', userValidation.addUser, authMiddleware, permissionMiddleware, addUser);
router.get('/:id', userValidation.getUser, authMiddleware, deviceMiddleware, getUser);
router.get('/', authMiddleware, deviceMiddleware, getUsers);
router.patch('/:id', userValidation.updateUser, authMiddleware, permissionMiddleware, updateUser);
router.delete('/:id', userValidation.removeUser, authMiddleware, permissionMiddleware, removeUser);

export default router;
