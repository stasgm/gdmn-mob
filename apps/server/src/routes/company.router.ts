import Router from 'koa-joi-router';

import { addCompany, updateCompany, getCompany, getCompanies, removeCompany } from '../controllers/company';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

import { companyValidation } from '../validations';

const router = Router();

router.prefix('/companies');
router.post('/', companyValidation.addCompany, authMiddleware, deviceMiddleware, addCompany);
router.get('/:id', companyValidation.getCompany, authMiddleware, deviceMiddleware, getCompany);
router.get('/', authMiddleware, deviceMiddleware, getCompanies);
router.patch('/:id', companyValidation.updateCompany, authMiddleware, deviceMiddleware, updateCompany);
router.delete('/:id', companyValidation.removeCompany, authMiddleware, deviceMiddleware, removeCompany);

export default router;
