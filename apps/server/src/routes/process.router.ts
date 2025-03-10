import router from 'koa-joi-router';

import {
  addProcess,
  cancelProcess,
  completeProcess,
  deleteProcess,
  getProcesses,
  interruptProcess,
  prepareProcess,
  updateProcess,
} from '../controllers/process';
import { authMiddleware, deviceMiddleware, processParamsMiddlware, setCompanyIdMiddleware } from '../middleware';
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
  setCompanyIdMiddleware,
  getProcesses,
);
processes.delete('/:id', processValidation.deleteProcess, authMiddleware, deviceMiddleware, deleteProcess);

export default processes;
