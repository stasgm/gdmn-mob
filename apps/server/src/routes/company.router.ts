import Router from 'koa-joi-router';

import { addCompany, updateCompany, getCompany, getCompanies, removeCompany } from '../controllers/company';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

import { companyValidation } from '../validations';

const router = Router();

router.prefix('/companies');
router.post('/', companyValidation.addCompany, addCompany); // TODO добавить compose([authMiddleware, deviceMiddleware])
router.get('/:id', companyValidation.updateCompany, authMiddleware, deviceMiddleware, getCompany);
router.get('/', authMiddleware, deviceMiddleware, getCompanies);
router.patch('/:id', [authMiddleware, deviceMiddleware], updateCompany);
router.delete('/:id', [authMiddleware, deviceMiddleware], removeCompany);

export default router;
