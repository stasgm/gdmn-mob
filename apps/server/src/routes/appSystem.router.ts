import Router from 'koa-joi-router';

import { getAppSystem, addAppSystem, getAppSystems, removeAppSystem, updateAppSystem } from '../controllers/appSystem';
import { authMiddleware } from '../middleware/authRequired';
import { companyMiddleware } from '../middleware/companyRequired';
// import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

const router = Router();

router.prefix('/appSystems');
router.post('/', /*companyValidation.addCompany,*/ authMiddleware, /*permissionMiddleware,*/ addAppSystem);
router.get(
  '/:id',
  // companyValidation.getCompany,
  authMiddleware,
  // deviceMiddleware,
  // roleBasedParamsMiddlware,
  getAppSystem,
);
router.get('/', authMiddleware, companyMiddleware, roleBasedParamsMiddlware, getAppSystems);
router.patch('/:id', /*companyValidation.updateCompany,*/ authMiddleware, /*permissionMiddleware,*/ updateAppSystem);
router.delete('/:id', /*companyValidation.removeCompany,*/ authMiddleware, /*permissionMiddleware,*/ removeAppSystem);

export default router;
