import route from 'koa-joi-router';

import { authMiddleware } from '../middleware/authRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';
import { fileValidation } from '../validations';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { getFiles, getFile, removeFile, updateFile, removeManyFiles } from '../controllers/file';

const file = route();

file.prefix('/files');
file.get('/:id', fileValidation.getFile, authMiddleware, deviceMiddleware, getFile);
file.get('/', authMiddleware, deviceMiddleware, getFiles);
file.patch(
  '/:id',
  fileValidation.updateFile,
  authMiddleware,
  permissionMiddleware,
  roleBasedParamsMiddlware,
  updateFile,
);
file.delete('/:id', fileValidation.removeFile, authMiddleware, removeFile);
file.delete('/', fileValidation.deleteFiles, authMiddleware, removeManyFiles);

export default file;
