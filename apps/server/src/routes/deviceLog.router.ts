import route from 'koa-joi-router';

import { authMiddleware, deviceMiddleware, superAdminMiddleware } from '../middleware';
import { deviceLogValidation } from '../validations';
import { addDeviceLog, getDeviceLogs, getDeviceLog, deleteDeviceLog, deleteDeviceLogs } from '../controllers/deviceLog';

const deviceLog = route();

deviceLog.prefix('/deviceLogs');

deviceLog.put('/', deviceLogValidation.addDeviceLog, authMiddleware, deviceMiddleware, addDeviceLog);
deviceLog.get('/', deviceLogValidation.getDeviceLogs, authMiddleware, superAdminMiddleware, getDeviceLogs);
deviceLog.get('/:id', deviceLogValidation.getDeviceLog, authMiddleware, superAdminMiddleware, getDeviceLog);
deviceLog.delete('/:id', deviceLogValidation.deleteDeviceLog, authMiddleware, superAdminMiddleware, deleteDeviceLog);

// Маршрут для массового удаления логов устройств
deviceLog.post(
  '/actions/deleteList',
  deviceLogValidation.deleteDeviceLogs,
  authMiddleware,
  superAdminMiddleware,
  deleteDeviceLogs,
);

export default deviceLog;
