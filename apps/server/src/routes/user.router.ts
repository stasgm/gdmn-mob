import router from 'koa-joi-router';

import { addUser, getUsers, getUser, removeUser, updateUser } from '../controllers/user';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

import { userValidation } from '../validations';

const users = router();

users.prefix('/users');
users.post('/', userValidation.addUser, authMiddleware, permissionMiddleware, addUser);
users.get('/:id', userValidation.getUser, authMiddleware, deviceMiddleware, getUser);
users.get('/', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, getUsers);
users.patch('/:id', userValidation.updateUser, authMiddleware, permissionMiddleware, updateUser);
users.delete('/:id', userValidation.removeUser, authMiddleware, permissionMiddleware, removeUser);

export default users;
