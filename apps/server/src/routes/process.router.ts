import Router from 'koa-joi-router';

import { api1, api2, api3, api4, api5, api6 } from '../controllers/process';
import { authMiddleware } from '../middleware/authRequired';
import { messageValidation } from '../validations';

const router = Router();

router.prefix('/process');
router.get('/:idDb', messageValidation.getMessage, authMiddleware, api1);
router.get('/:idDb', messageValidation.getMessage, authMiddleware, api2);
router.get('/:idDb', messageValidation.getMessage, authMiddleware, api3);
router.get('/:idDb', messageValidation.getMessage, authMiddleware, api4);
router.get('/:idDb', messageValidation.getMessage, authMiddleware, api5);
router.get('/:idDb', messageValidation.getMessage, authMiddleware, api6);

export default router;
