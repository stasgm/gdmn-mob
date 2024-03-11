import route from 'koa-joi-router';

import { addErpLog, getErpLog } from '../controllers/erpLog';

import { authMiddleware, deviceMiddleware, fileUploadMiddleware, superAdminMiddleware } from '../middleware';
import { erpLogValidation } from '../validations';

const erpLog = route();

erpLog.prefix('/erpLogs');

erpLog.post('/', authMiddleware, deviceMiddleware, fileUploadMiddleware(), addErpLog);
erpLog.get('/:id', erpLogValidation.getErpLog, authMiddleware, superAdminMiddleware, getErpLog);

export default erpLog;
