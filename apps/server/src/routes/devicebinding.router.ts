import Router from 'koa-joi-router';

import {
  addDeviceBinding,
  getDeviceBindings,
  getDeviceBinding,
  removeDeviceBinding,
  updateDeviceBinding,
} from '../controllers/deviceBinding';
import { authMiddleware } from '../middleware/authRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

import { deviceBindingValidation } from '../validations';

const router = Router();

router.prefix('/binding');
router.post(
  '/',
  deviceBindingValidation.bindingDevice,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  addDeviceBinding,
);
router.get('/', authMiddleware, permissionMiddleware, roleBasedParamsMiddlware, getDeviceBindings);
router.get(
  '/:id',
  deviceBindingValidation.getDeviceBinding,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  getDeviceBinding,
);
router.patch(
  '/:id',
  deviceBindingValidation.updateDeviceBinding,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  updateDeviceBinding,
);
router.delete('/:id', authMiddleware, permissionMiddleware, roleBasedParamsMiddlware, removeDeviceBinding);

export default router;
