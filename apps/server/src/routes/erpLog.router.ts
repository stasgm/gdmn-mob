import route from 'koa-joi-router';

import { addErpLog, getErpLogContent } from '../controllers/erpLog';

import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { erpLogValidation } from '../validations';
import { fileUploadMiddleware } from '../middleware/fileUploadMiddleware';
import { superAdminMiddleware } from '../middleware/superAdminRequired';

const erpLog = route();

erpLog.prefix('/erpLogs');

erpLog.post('/', authMiddleware, deviceMiddleware, fileUploadMiddleware(), addErpLog);

erpLog.get('/:id/content', erpLogValidation.getErpLog, authMiddleware, superAdminMiddleware, getErpLogContent);

export default erpLog;
