import route from 'koa-joi-router';

import { getAppSystem, addAppSystem, getAppSystems, removeAppSystem, updateAppSystem } from '../controllers/appSystem';
import { authMiddleware } from '../middleware/authRequired';
import { companyMiddleware } from '../middleware/companyRequired';
// import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

const appSystems = route();

appSystems.prefix('/appSystems');
appSystems.post('/', /*companyValidation.addCompany,*/ authMiddleware, /*permissionMiddleware,*/ addAppSystem);
appSystems.get(
  '/:id',
  // companyValidation.getCompany,
  authMiddleware,
  // deviceMiddleware,
  // roleBasedParamsMiddlware,
  getAppSystem,
);
appSystems.get('/', authMiddleware, companyMiddleware, roleBasedParamsMiddlware, getAppSystems);
appSystems.patch(
  '/:id',
  /*companyValidation.updateCompany,*/ authMiddleware,
  /*permissionMiddleware,*/ updateAppSystem,
);
appSystems.delete(
  '/:id',
  /*companyValidation.removeCompany,*/ authMiddleware,
  /*roleBasedParamsMiddlware,*/ removeAppSystem,
);

export default appSystems;
