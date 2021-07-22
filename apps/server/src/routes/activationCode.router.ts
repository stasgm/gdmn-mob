import Router from 'koa-joi-router';

import { addDevice, getDevices, updateDevice, removeDevice, getDevice } from '../controllers/device';
import { getActivationCodes } from '../controllers/activationCode';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

import { deviceValidation } from '../validations';

const router = Router();

router.prefix('/activationCodes');
router.get('/', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, getActivationCodes);

export default router;
