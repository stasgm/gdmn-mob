import router from 'koa-joi-router';

import { getActivationCode, getActivationCodes } from '../controllers/activationCode';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

const codes = router();

codes.prefix('/codes');
codes.get('/', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, getActivationCodes);
codes.get('/device/:deviceId/code', authMiddleware, permissionMiddleware, getActivationCode);

export default codes;
