import route from 'koa-joi-router';

import { authMiddleware } from '../middleware/authRequired';
//import { deviceLogValidation } from '../validations';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { getServerLogs, getServerLog } from '../controllers/serverLog';

const serverLog = route();

serverLog.prefix('/serverLogs');
//deviceLog.post('/', deviceLogValidation.addDeviceLog, authMiddleware, deviceMiddleware, addDeviceLog);
serverLog.get('/:id', authMiddleware, deviceMiddleware, getServerLog);
serverLog.get('/', authMiddleware, deviceMiddleware, getServerLogs);
// deviceLog.patch('/:id', appSystemValidation.updateAppSystem, authMiddleware, updateAppSystem);
//deviceLog.delete('/:id', deviceLogValidation.removeDeviceLog, authMiddleware, removeDeviceLog);

export default serverLog;
