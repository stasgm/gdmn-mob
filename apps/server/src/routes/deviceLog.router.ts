import route from 'koa-joi-router';

import { authMiddleware } from '../middleware/authRequired';
import { deviceLogValidation } from '../validations';
import { deviceMiddleware } from '../middleware/deviceRequired';
import {
  addDeviceLog,
  getDeviceLogs,
  getDeviceLogContent,
  deleteDeviceLog,
  deleteDeviceLogs,
} from '../controllers/deviceLog';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { superAdminMiddleware } from '../middleware/superAdminRequired';

const deviceLog = route();

deviceLog.prefix('/deviceLogs');
deviceLog.post('/', deviceLogValidation.addDeviceLog, authMiddleware, deviceMiddleware, addDeviceLog);
deviceLog.get(
  '/:id/content',
  deviceLogValidation.getDeviceLogContent,
  authMiddleware,
  superAdminMiddleware,
  getDeviceLogContent,
);
deviceLog.get('/', deviceLogValidation.getDeviceLogs, authMiddleware, superAdminMiddleware, getDeviceLogs);
deviceLog.delete('/:id', deviceLogValidation.deleteDeviceLog, authMiddleware, superAdminMiddleware, deleteDeviceLog);
deviceLog.post(
  '/deleteList',
  deviceLogValidation.deleteDeviceLogs,
  authMiddleware,
  superAdminMiddleware,
  deleteDeviceLogs,
);

export default deviceLog;
