import Router from 'koa-joi-router';

import { addProcess, updateProcess, removeProcess, cancelProcess, breakProcess } from '../controllers/process';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { processValidation } from '../validations';

const router = Router();

router.prefix('/process');
router.post('/', processValidation.addProcess, authMiddleware, deviceMiddleware, addProcess);
// router.get('/:id', messageValidation.getMessage, authMiddleware, api2);
router.patch('/:id', processValidation.updateProcess, authMiddleware, deviceMiddleware, updateProcess);
router.delete('/:id', processValidation.removeProcess, authMiddleware, deviceMiddleware, removeProcess);
router.delete('/:id', processValidation.cancelProcess, authMiddleware, deviceMiddleware, cancelProcess);
router.delete('/:id', processValidation.breakProcess, authMiddleware, deviceMiddleware, breakProcess);

export default router;
