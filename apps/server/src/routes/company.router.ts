import router from 'koa-joi-router';

import { addCompany, getCompanies, getCompany, removeCompany, updateCompany } from '../controllers/company';
import {
  authMiddleware,
  deviceMiddleware,
  adminMiddleware,
  setAdminIdMiddleware,
  setCompanyIdMiddleware,
} from '../middleware';

import { companyValidation } from '../validations';

const companies = router();

companies.prefix('/companies');
companies.post('/', companyValidation.addCompany, authMiddleware, adminMiddleware, addCompany);
companies.get(
  '/:id',
  companyValidation.getCompany,
  authMiddleware,
  deviceMiddleware,
  setCompanyIdMiddleware,
  getCompany,
);
companies.get('/', authMiddleware, deviceMiddleware, setCompanyIdMiddleware, setAdminIdMiddleware, getCompanies);
companies.patch('/:id', companyValidation.updateCompany, authMiddleware, adminMiddleware, updateCompany);
companies.delete('/:id', companyValidation.removeCompany, authMiddleware, adminMiddleware, removeCompany);

export default companies;
