import Router from 'koa-joi-router';

import {
  addProcess,
  updateProcess,
  prepareProcess,
  completeProcess,
  cancelProcess,
  interruptProcess,
  getProcesses,
  deleteProcess,
} from '../controllers/process';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { processParamsMiddlware } from '../middleware/processParams';
import { processValidation } from '../validations';

const router = Router();

router.prefix('/process');
router.post('/', processValidation.addProcess, authMiddleware, deviceMiddleware, processParamsMiddlware, addProcess);
router.patch('/:id', processValidation.updateProcess, authMiddleware, deviceMiddleware, updateProcess);
router.patch('/:id/prepare', processValidation.prepareProcess, authMiddleware, deviceMiddleware, prepareProcess);
router.delete('/:id/complete', processValidation.completeProcess, authMiddleware, deviceMiddleware, completeProcess);
router.delete('/:id/cancel', processValidation.cancelProcess, authMiddleware, deviceMiddleware, cancelProcess);
router.delete('/:id/interrupt', processValidation.interruptProcess, authMiddleware, deviceMiddleware, interruptProcess);
router.get('/', /*processValidation.getProcesses,*/ authMiddleware, deviceMiddleware, getProcesses);
router.delete('/:id', processValidation.deleteProcess, authMiddleware, deviceMiddleware, deleteProcess);

export default router;
