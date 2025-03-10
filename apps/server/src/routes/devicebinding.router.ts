import router from 'koa-joi-router';

import {
  addDeviceBinding,
  getDeviceBinding,
  getDeviceBindings,
  removeDeviceBinding,
  updateDeviceBinding,
} from '../controllers/deviceBinding';
import { authMiddleware, adminMiddleware, setCompanyIdMiddleware } from '../middleware';

import { deviceBindingValidation } from '../validations';

const deviceBindings = router();

deviceBindings.prefix('/binding');
deviceBindings.post(
  '/',
  deviceBindingValidation.bindingDevice,
  authMiddleware,
  adminMiddleware,
  setCompanyIdMiddleware,
  addDeviceBinding,
);
deviceBindings.get('/', authMiddleware, adminMiddleware, setCompanyIdMiddleware, getDeviceBindings);
deviceBindings.get(
  '/:id',
  deviceBindingValidation.getDeviceBinding,
  authMiddleware,
  adminMiddleware,
  setCompanyIdMiddleware,
  getDeviceBinding,
);
deviceBindings.patch(
  '/:id',
  deviceBindingValidation.updateDeviceBinding,
  authMiddleware,
  adminMiddleware,
  setCompanyIdMiddleware,
  updateDeviceBinding,
);
deviceBindings.delete('/:id', authMiddleware, adminMiddleware, setCompanyIdMiddleware, removeDeviceBinding);

export default deviceBindings;
