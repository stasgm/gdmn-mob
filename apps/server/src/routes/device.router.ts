import Router from 'koa-joi-router';

import { addDevice, getDevices, updateDevice, removeDevice, getDevice } from '../controllers/device';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

import { deviceValidation } from '../validations';

const router = Router();

router.prefix('/devices');
router.post('/', deviceValidation.addDevice, authMiddleware, permissionMiddleware, roleBasedParamsMiddlware, addDevice);
router.get('/', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, getDevices);
router.get('/:id', deviceValidation.getDevice, deviceMiddleware, roleBasedParamsMiddlware, getDevice);
router.patch(
  '/:id',
  deviceValidation.updateDevice,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  updateDevice,
);
router.delete(
  '/:id',
  deviceValidation.removeDevice,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  removeDevice,
);

export default router;
