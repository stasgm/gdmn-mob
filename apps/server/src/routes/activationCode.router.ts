import Router from 'koa-joi-router';

import { getActivationCode, getActivationCodes } from '../controllers/activationCode';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

const router = Router();

router.prefix('/codes');
router.get('/', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, getActivationCodes);
router.get('/device/:deviceId/code', authMiddleware, permissionMiddleware, getActivationCode);

export default router;
