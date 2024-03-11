import route from 'koa-joi-router';

import { authMiddleware, superAdminMiddleware } from '../middleware';
import { fileValidation } from '../validations';
import { getFiles, getFile, deleteFile, updateFile, deleteFiles, getFolders, moveFiles } from '../controllers/file';

const file = route();

console.log('files');

file.prefix('/files');

file.get('/', fileValidation.getFiles, authMiddleware, superAdminMiddleware, getFiles);
file.get('/:id', fileValidation.getFile, authMiddleware, superAdminMiddleware, getFile);
file.put('/:id', fileValidation.updateFile, authMiddleware, superAdminMiddleware, updateFile);
file.delete('/:id', fileValidation.deleteFile, authMiddleware, superAdminMiddleware, deleteFile);

// Маршрут для получения списка папок
file.get('/folders', fileValidation.getFolders, authMiddleware, superAdminMiddleware, getFolders);

// Маршруты для массовых операций с файлами
file.post('/actions/deleteList', fileValidation.deleteFiles, authMiddleware, superAdminMiddleware, deleteFiles);
file.post('/actions/moveList', fileValidation.moveFiles, authMiddleware, superAdminMiddleware, moveFiles);

export default file;
