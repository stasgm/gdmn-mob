import router from 'koa-joi-router';

import {
  addUser,
  getUser,
  getUserWithDevice,
  getUsers,
  getUsersWithDevice,
  removeUser,
  updateUser,
} from '../controllers/user';

import { authMiddleware, deviceMiddleware, adminMiddleware, setCompanyIdMiddleware } from '../middleware';

import { userValidation } from '../validations';

const users = router();

users.prefix('/users');
users.post('/', userValidation.addUser, authMiddleware, adminMiddleware, addUser);
users.get('/withdevice/:id', userValidation.getUser, authMiddleware, deviceMiddleware, getUserWithDevice);
users.get('/withdevice', authMiddleware, deviceMiddleware, setCompanyIdMiddleware, getUsersWithDevice);
users.get('/:id', userValidation.getUser, authMiddleware, deviceMiddleware, getUser);
users.get('/', authMiddleware, deviceMiddleware, setCompanyIdMiddleware, getUsers);
users.patch('/:id', userValidation.updateUser, authMiddleware, adminMiddleware, updateUser);
users.delete('/:id', userValidation.removeUser, authMiddleware, adminMiddleware, removeUser);

export default users;
