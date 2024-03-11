import router from 'koa-joi-router';

import { getActivationCode, getActivationCodes } from '../controllers/activationCode';
import { authMiddleware, deviceMiddleware, permissionMiddleware, roleBasedParamsMiddlware } from '../middleware';

const codes = router();

codes.prefix('/codes');
codes.get('/', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, getActivationCodes);
codes.get('/device/:deviceId/code', authMiddleware, permissionMiddleware, getActivationCode);

export default codes;
