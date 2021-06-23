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

import { deviceBindingValidation } from '../validations';

const router = Router();

router.prefix('/binding');
router.post('/', deviceBindingValidation.bindingDevice, authMiddleware, permissionMiddleware, addDeviceBinding);
router.get('/', authMiddleware, permissionMiddleware, getDeviceBindings);
router.get('/:id', deviceBindingValidation.getDeviceBinding, authMiddleware, permissionMiddleware, getDeviceBinding);
router.patch(
  '/:id',
  deviceBindingValidation.updateDeviceBinding,
  authMiddleware,
  permissionMiddleware,
  updateDeviceBinding,
);
router.delete('/:id', authMiddleware, permissionMiddleware, removeDeviceBinding);

export default router;
