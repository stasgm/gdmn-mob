import { existsSync, mkdirSync } from 'fs';

import path from 'path';

import route from 'koa-joi-router';
import koaBodyMiddleware from 'koa-body';

import { Next } from 'koa';

import { addErpLog, getErpLog } from '../controllers/erpLog';

import config from '../../config';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { InvalidParameterException } from '../exceptions';
import { erpLogValidation } from '../validations';

// Логи для Erp
const uploadDir = path.join(process.cwd(), config.ERP_LOG_PATH);
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

const erpLog = route();

erpLog.prefix('/erpLogs');

let fileCount = 0;

erpLog.post(
  '/',
  authMiddleware,
  deviceMiddleware,
  async (ctx, next: Next) => {
    fileCount = 0;
    await next();
  },
  koaBodyMiddleware({
    multipart: true,
    formidable: {
      uploadDir, // Путь для сохранения файлов
      keepExtensions: true,
      onFileBegin: (name, file) => {
        if (name !== 'logFile') {
          throw new InvalidParameterException('Неверно указан параметр для файла');
        }

        if (!file.filepath || path.extname(file.filepath) !== '.txt') {
          throw new InvalidParameterException('Неверное расширение файла');
        }

        fileCount++;
        if (fileCount > 1) {
          throw new InvalidParameterException('Неверное количество файлов');
        }
      },
    },
  }) as any,
  addErpLog,
);

erpLog.get('/', erpLogValidation.getErpLog, authMiddleware, deviceMiddleware, getErpLog);

export default erpLog;
