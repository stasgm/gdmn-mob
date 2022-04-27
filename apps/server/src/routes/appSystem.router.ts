import Router from 'koa-joi-router';

// import { getActivationCode, getActivationCodes } from '../controllers/activationCode';
import { /*getAppSystem,*/ getAppSystems } from '../controllers/appSystem';
import { authMiddleware } from '../middleware/authRequired';
// import { deviceMiddleware } from '../middleware/deviceRequired';
import { companyMiddleware } from '../middleware/companyRequired';
// import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

const router = Router();

router.prefix('/appSystems');
router.get('/', authMiddleware, companyMiddleware, roleBasedParamsMiddlware, getAppSystems);
// router.get('/device/:deviceId/code', authMiddleware, permissionMiddleware, getActivationCode);

export default router;
