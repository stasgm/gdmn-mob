import Router from 'koa-joi-router';

import {
  addDeviceBinding,
  getDeviceBindings,
  getDeviceBinding,
  removeDeviceBinding,
  updateDeviceBinding,
} from '../controllers/deviceBinding';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

import { deviceBindingValidation } from '../validations';

const router = Router();

router.prefix('/binding');
router.post('/', deviceBindingValidation.bindingDevice, deviceMiddleware, authMiddleware, addDeviceBinding);
router.get('/', deviceMiddleware, authMiddleware, getDeviceBindings);
router.get('/:id', deviceBindingValidation.getDeviceBinding, deviceMiddleware, authMiddleware, getDeviceBinding);
router.patch(
  '/:id',
  deviceBindingValidation.updateDeviceBinding,
  deviceMiddleware,
  authMiddleware,
  updateDeviceBinding,
);
router.delete('/:id', deviceMiddleware, authMiddleware, removeDeviceBinding);

export default router;
