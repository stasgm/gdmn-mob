import router from 'koa-joi-router';

import {
  addUser,
  getUsers,
  getUser,
  removeUser,
  updateUser,
  getUsersWithDevice,
  getUserWithDevice,
  addErrrorNotice,
} from '../controllers/user';

import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';
import { messageMiddleware } from '../middleware/messageRequired';

import { userValidation } from '../validations';

const users = router();

users.prefix('/users');
users.post('/', userValidation.addUser, authMiddleware, permissionMiddleware, addUser);
users.get('/withdevice/:id', userValidation.getUser, authMiddleware, deviceMiddleware, getUserWithDevice);
users.get('/withdevice', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, getUsersWithDevice);
users.get('/:id', userValidation.getUser, authMiddleware, deviceMiddleware, getUser);
users.get('/', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, getUsers);
users.patch('/:id', userValidation.updateUser, authMiddleware, permissionMiddleware, updateUser);
users.delete('/:id', userValidation.removeUser, authMiddleware, permissionMiddleware, removeUser);
users.post(
  '/mobileErrors',
  userValidation.addNotice,
  authMiddleware,
  deviceMiddleware,
  messageMiddleware,
  addErrrorNotice,
);

export default users;
