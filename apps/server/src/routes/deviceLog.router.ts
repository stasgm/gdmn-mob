import route from 'koa-joi-router';

import { authMiddleware } from '../middleware/authRequired';
import { deviceLogValidation } from '../validations';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { addDeviceLog, getDeviceLogs, getDeviceLog, removeDeviceLog } from '../controllers/deviceLog';

const deviceLog = route();

deviceLog.prefix('/deviceLogs');
deviceLog.post('/', deviceLogValidation.addDeviceLog, authMiddleware, deviceMiddleware, addDeviceLog);
deviceLog.get('/:id', deviceLogValidation.getDeviceLog, authMiddleware, deviceMiddleware, getDeviceLog);
deviceLog.get('/', authMiddleware, deviceMiddleware, getDeviceLogs);
deviceLog.delete('/:id', deviceLogValidation.removeDeviceLog, authMiddleware, removeDeviceLog);

export default deviceLog;
