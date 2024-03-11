import router from 'koa-joi-router';

import {
  addDeviceBinding,
  getDeviceBindings,
  getDeviceBinding,
  removeDeviceBinding,
  updateDeviceBinding,
} from '../controllers/deviceBinding';
import { authMiddleware, permissionMiddleware, roleBasedParamsMiddlware } from '../middleware';

import { deviceBindingValidation } from '../validations';

const deviceBindings = router();

deviceBindings.prefix('/binding');
deviceBindings.post(
  '/',
  deviceBindingValidation.bindingDevice,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  addDeviceBinding,
);
deviceBindings.get('/', authMiddleware, permissionMiddleware, roleBasedParamsMiddlware, getDeviceBindings);
deviceBindings.get(
  '/:id',
  deviceBindingValidation.getDeviceBinding,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  getDeviceBinding,
);
deviceBindings.patch(
  '/:id',
  deviceBindingValidation.updateDeviceBinding,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  updateDeviceBinding,
);
deviceBindings.delete('/:id', authMiddleware, permissionMiddleware, roleBasedParamsMiddlware, removeDeviceBinding);

export default deviceBindings;
