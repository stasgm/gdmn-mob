import route from 'koa-joi-router';

import { authMiddleware } from '../middleware/authRequired';
import { serverLogValidation } from '../validations';
import { getServerLogs, getServerLog, deleteServerLog, deleteServerLogs } from '../controllers/serverLog';
import { superAdminMiddleware } from '../middleware/superAdminRequired';

const serverLog = route();

serverLog.prefix('/serverLogs');
serverLog.get('/:id/content', serverLogValidation.getServerLog, authMiddleware, superAdminMiddleware, getServerLog);
serverLog.get('/', serverLogValidation.getServerLogs, authMiddleware, superAdminMiddleware, getServerLogs);
serverLog.delete('/:id', serverLogValidation.deleteServerLog, authMiddleware, superAdminMiddleware, deleteServerLog);
serverLog.post(
  '/deleteList',
  serverLogValidation.deleteServerLogs,
  authMiddleware,
  superAdminMiddleware,
  deleteServerLogs,
);

export default serverLog;
