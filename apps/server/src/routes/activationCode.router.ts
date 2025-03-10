import router from 'koa-joi-router';

import { getActivationCode, getActivationCodes } from '../controllers/activationCode';
import { authMiddleware, deviceMiddleware, adminMiddleware, setCompanyIdMiddleware } from '../middleware';

const codes = router();

codes.prefix('/codes');
codes.get('/', authMiddleware, deviceMiddleware, setCompanyIdMiddleware, getActivationCodes);
codes.get('/device/:deviceId/code', authMiddleware, adminMiddleware, getActivationCode);

export default codes;
