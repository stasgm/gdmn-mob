import router from 'koa-joi-router';

import { addDevice, getDevices, updateDevice, removeDevice, getDevice } from '../controllers/device';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

import { deviceValidation } from '../validations';

const devices = router();

devices.prefix('/devices');
devices.post(
  '/',
  deviceValidation.addDevice,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  addDevice,
);
devices.get('/', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, getDevices);
devices.get('/:id', deviceValidation.getDevice, deviceMiddleware, roleBasedParamsMiddlware, getDevice);
devices.patch(
  '/:id',
  deviceValidation.updateDevice,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  updateDevice,
);
devices.delete(
  '/:id',
  deviceValidation.removeDevice,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  removeDevice,
);

export default devices;
