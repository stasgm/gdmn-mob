import route from 'koa-joi-router';

import { authMiddleware, superAdminMiddleware } from '../middleware';
import { serverLogValidation } from '../validations';
import { getServerLogs, getServerLog, deleteServerLog, deleteServerLogs } from '../controllers/serverLog';

const serverLog = route();

serverLog.prefix('/serverLogs');

serverLog.get('/', serverLogValidation.getServerLogs, authMiddleware, superAdminMiddleware, getServerLogs);
serverLog.get('/:id', serverLogValidation.getServerLog, authMiddleware, superAdminMiddleware, getServerLog);
serverLog.delete('/:id', serverLogValidation.deleteServerLog, authMiddleware, superAdminMiddleware, deleteServerLog);

// Маршрут для массового удаления логов сервера
serverLog.post(
  '/actions/deleteList',
  serverLogValidation.deleteServerLogs,
  authMiddleware,
  superAdminMiddleware,
  deleteServerLogs,
);

export default serverLog;
