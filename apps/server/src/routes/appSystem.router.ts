import route from 'koa-joi-router';

import { addAppSystem, getAppSystem, getAppSystems, removeAppSystem, updateAppSystem } from '../controllers/appSystem';
import { authMiddleware, setAdminIdMiddleware, setCompanyIdMiddleware, superAdminMiddleware } from '../middleware';
import { appSystemValidation } from '../validations';

const appSystems = route();

appSystems.prefix('/appSystems');
appSystems.post('/', appSystemValidation.addAppSystem, authMiddleware, superAdminMiddleware, addAppSystem);
appSystems.get('/:id', appSystemValidation.getAppSystem, authMiddleware, getAppSystem);
appSystems.get('/', authMiddleware, setAdminIdMiddleware, setCompanyIdMiddleware, getAppSystems);
appSystems.patch('/:id', appSystemValidation.updateAppSystem, authMiddleware, superAdminMiddleware, updateAppSystem);
appSystems.delete('/:id', appSystemValidation.removeAppSystem, authMiddleware, superAdminMiddleware, removeAppSystem);

export default appSystems;
