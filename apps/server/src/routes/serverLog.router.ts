import route from 'koa-joi-router';

import { authMiddleware } from '../middleware/authRequired';
import { serverLogValidation } from '../validations';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { getServerLogs, getServerLog } from '../controllers/serverLog';

const serverLog = route();

serverLog.prefix('/serverLogs');
serverLog.get('/:id', serverLogValidation.getServerLog, authMiddleware, deviceMiddleware, getServerLog);
serverLog.get('/', authMiddleware, deviceMiddleware, getServerLogs);

export default serverLog;
