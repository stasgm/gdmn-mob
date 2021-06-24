import Router from 'koa-joi-router';

import { addCompany, updateCompany, getCompany, getCompanies, removeCompany } from '../controllers/company';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

import { companyValidation } from '../validations';

const router = Router();

router.prefix('/companies');
router.post('/', companyValidation.addCompany, authMiddleware, permissionMiddleware, addCompany);
router.get('/:id', companyValidation.getCompany, authMiddleware, deviceMiddleware, getCompany);
router.get('/', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, getCompanies);
router.patch('/:id', companyValidation.updateCompany, authMiddleware, permissionMiddleware, updateCompany);
router.delete('/:id', companyValidation.removeCompany, authMiddleware, permissionMiddleware, removeCompany);

export default router;
