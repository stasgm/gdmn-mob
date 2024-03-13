import router from 'koa-joi-router';

import { addDevice, getDevice, getDevices, removeDevice, updateDevice } from '../controllers/device';
import { authMiddleware, deviceMiddleware, adminMiddleware, setCompanyIdMiddleware } from '../middleware';

import { deviceValidation } from '../validations';

const devices = router();

devices.prefix('/devices');
devices.post('/', deviceValidation.addDevice, authMiddleware, adminMiddleware, setCompanyIdMiddleware, addDevice);
devices.get('/', authMiddleware, deviceMiddleware, setCompanyIdMiddleware, getDevices);
devices.get('/:id', deviceValidation.getDevice, deviceMiddleware, setCompanyIdMiddleware, getDevice);
devices.patch(
  '/:id',
  deviceValidation.updateDevice,
  authMiddleware,
  adminMiddleware,
  setCompanyIdMiddleware,
  updateDevice,
);
devices.delete(
  '/:id',
  deviceValidation.removeDevice,
  authMiddleware,
  adminMiddleware,
  setCompanyIdMiddleware,
  removeDevice,
);

export default devices;
