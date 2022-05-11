import Router from 'koa-joi-router';

import { getAppSystem, addAppSystem, getAppSystems, removeAppSystem, updateAppSystem } from '../controllers/appSystem';
import { authMiddleware } from '../middleware/authRequired';
import { companyMiddleware } from '../middleware/companyRequired';
// import { permissionMiddleware } from '../middleware/permissionRequired';
import { appSystemMiddleware } from '../middleware/appSystemRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';
import { appSystemValidation } from '../validations';

const router = Router();

router.prefix('/appSystems');
router.post('/', appSystemValidation.addAppSystem, authMiddleware, appSystemMiddleware, addAppSystem);
router.get('/:id', appSystemValidation.getAppSystem, authMiddleware, getAppSystem);
router.get('/', authMiddleware, companyMiddleware, roleBasedParamsMiddlware, getAppSystems);
router.patch('/:id', appSystemValidation.updateAppSystem, authMiddleware, appSystemMiddleware, updateAppSystem);
router.delete('/:id', appSystemValidation.removeAppSystem, authMiddleware, appSystemMiddleware, removeAppSystem);

export default router;
