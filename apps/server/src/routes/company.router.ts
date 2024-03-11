import router from 'koa-joi-router';

import { addCompany, updateCompany, getCompany, getCompanies, removeCompany } from '../controllers/company';
import {
  authMiddleware,
  companyMiddleware,
  deviceMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
} from '../middleware';

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
