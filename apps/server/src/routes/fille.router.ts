import route from 'koa-joi-router';

import { authMiddleware } from '../middleware/authRequired';
//import { deviceLogValidation } from '../validations';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { getFiles } from '../controllers/file';

const file = route();

file.prefix('/files');
//file.get('/:id', deviceLogValidation.getDeviceLog, authMiddleware, deviceMiddleware, getDeviceLog);
file.get('/', authMiddleware, deviceMiddleware, getFiles);
// deviceLog.patch('/:id', appSystemValidation.updateAppSystem, authMiddleware, updateAppSystem);
//file.delete('/:id', deviceLogValidation.removeDeviceLog, authMiddleware, removeDeviceLog);

export default file;
