import route from 'koa-joi-router';

import { authMiddleware } from '../middleware/authRequired';
import { companyMiddleware } from '../middleware/companyRequired';
import { appSystemMiddleware } from '../middleware/appSystemRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';
import { deviceLogValidation } from '../validations';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { addDeviceLog, getDeviceLogs, getDeviceLog } from '../controllers/deviceLog';

const deviceLog = route();

deviceLog.prefix('/deviceLogs');
deviceLog.post('/', deviceLogValidation.addDeviceLog, authMiddleware, deviceMiddleware, addDeviceLog);
deviceLog.get('/:id', authMiddleware, deviceMiddleware, getDeviceLog);
deviceLog.get('/', authMiddleware, deviceMiddleware, getDeviceLogs);
// deviceLog.patch('/:id', appSystemValidation.updateAppSystem, authMiddleware, appSystemMiddleware, updateAppSystem);
// deviceLog.delete('/:id', appSystemValidation.removeAppSystem, authMiddleware, appSystemMiddleware, removeAppSystem);

export default deviceLog;
