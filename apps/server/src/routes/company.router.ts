import router from 'koa-joi-router';

import { addCompany, updateCompany, getCompany, getCompanies, removeCompany } from '../controllers/company';
import { authMiddleware } from '../middleware/authRequired';
import { companyMiddleware } from '../middleware/companyRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';

import { companyValidation } from '../validations';

const companies = router();

companies.prefix('/companies');
companies.post('/', companyValidation.addCompany, authMiddleware, permissionMiddleware, addCompany);
companies.get(
  '/:id',
  companyValidation.getCompany,
  authMiddleware,
  deviceMiddleware,
  roleBasedParamsMiddlware,
  getCompany,
);
companies.get('/', authMiddleware, deviceMiddleware, roleBasedParamsMiddlware, companyMiddleware, getCompanies);
companies.patch('/:id', companyValidation.updateCompany, authMiddleware, permissionMiddleware, updateCompany);
companies.delete('/:id', companyValidation.removeCompany, authMiddleware, permissionMiddleware, removeCompany);

export default companies;
