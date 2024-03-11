import route from 'koa-joi-router';

import { getAppSystem, addAppSystem, getAppSystems, removeAppSystem, updateAppSystem } from '../controllers/appSystem';
import { authMiddleware, companyMiddleware, superAdminMiddleware, roleBasedParamsMiddlware } from '../middleware';
import { appSystemValidation } from '../validations';

const appSystems = route();

appSystems.prefix('/appSystems');
appSystems.post('/', appSystemValidation.addAppSystem, authMiddleware, superAdminMiddleware, addAppSystem);
appSystems.get('/:id', appSystemValidation.getAppSystem, authMiddleware, getAppSystem);
appSystems.get('/', authMiddleware, companyMiddleware, roleBasedParamsMiddlware, getAppSystems);
appSystems.patch('/:id', appSystemValidation.updateAppSystem, authMiddleware, superAdminMiddleware, updateAppSystem);
appSystems.delete('/:id', appSystemValidation.removeAppSystem, authMiddleware, superAdminMiddleware, removeAppSystem);

export default appSystems;
