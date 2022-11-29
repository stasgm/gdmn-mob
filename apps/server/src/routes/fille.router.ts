import route from 'koa-joi-router';

import { authMiddleware } from '../middleware/authRequired';
import { fileValidation } from '../validations';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { getFiles, getFile } from '../controllers/file';

const file = route();

file.prefix('/files');
file.get('/:id', fileValidation.getFile, authMiddleware, deviceMiddleware, getFile);
file.get('/', authMiddleware, deviceMiddleware, getFiles);
// deviceLog.patch('/:id', appSystemValidation.updateAppSystem, authMiddleware, updateAppSystem);
//file.delete('/:id', deviceLogValidation.removeDeviceLog, authMiddleware, removeDeviceLog);

export default file;
