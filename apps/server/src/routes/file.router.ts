import route from 'koa-joi-router';

import { authMiddleware } from '../middleware/authRequired';
import { permissionMiddleware } from '../middleware/permissionRequired';
import { roleBasedParamsMiddlware } from '../middleware/roleBasedParams';
import { fileValidation } from '../validations';
import { deviceMiddleware } from '../middleware/deviceRequired';
import {
  getFiles,
  getFileContent,
  deleteFile,
  updateFile,
  deleteFiles,
  getFolders,
  moveFiles,
} from '../controllers/file';
import { superAdminMiddleware } from '../middleware/superAdminRequired';

const file = route();

file.prefix('/files');
file.get('/folders', fileValidation.getFolders, authMiddleware, superAdminMiddleware, getFolders);
file.get('/', fileValidation.getFiles, authMiddleware, superAdminMiddleware, getFiles);
file.get('/:id/content', fileValidation.getFileContent, authMiddleware, superAdminMiddleware, getFileContent);
file.put('/:id', fileValidation.updateFile, authMiddleware, superAdminMiddleware, updateFile);
file.delete('/:id', fileValidation.deleteFile, authMiddleware, superAdminMiddleware, deleteFile);
file.post('/deleteList', fileValidation.deleteFiles, authMiddleware, superAdminMiddleware, deleteFiles);
file.post('/moveList', fileValidation.moveFiles, authMiddleware, superAdminMiddleware, moveFiles);

export default file;
