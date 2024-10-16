import router from 'koa-joi-router';

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
import { getProcessParamsMiddlware } from '../middleware/getProcessParams';
import { processValidation } from '../validations';

const processes = router();

processes.prefix('/processes');
processes.post('/', processValidation.addProcess, authMiddleware, deviceMiddleware, processParamsMiddlware, addProcess);
processes.patch('/:id', processValidation.updateProcess, authMiddleware, deviceMiddleware, updateProcess);
processes.patch('/:id/prepare', processValidation.prepareProcess, authMiddleware, deviceMiddleware, prepareProcess);
processes.delete('/:id/complete', processValidation.completeProcess, authMiddleware, deviceMiddleware, completeProcess);
processes.delete('/:id/cancel', processValidation.cancelProcess, authMiddleware, deviceMiddleware, cancelProcess);
processes.delete(
  '/:id/interrupt',
  processValidation.interruptProcess,
  authMiddleware,
  deviceMiddleware,
  interruptProcess,
);
processes.get(
  '/',
  processValidation.getProcesses,
  authMiddleware,
  deviceMiddleware,
  getProcessParamsMiddlware,
  getProcesses,
);
processes.delete('/:id', processValidation.deleteProcess, authMiddleware, deviceMiddleware, deleteProcess);

export default processes;
