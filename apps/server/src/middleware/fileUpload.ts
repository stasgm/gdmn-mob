import { existsSync, mkdirSync } from 'fs';
import path from 'path';

import koaBodyMiddleware from 'koa-body';

import { InvalidParameterException } from '../exceptions';
import { uploadErpLogsFolder } from '../services/fileUtils';

if (!existsSync(uploadErpLogsFolder)) {
  mkdirSync(uploadErpLogsFolder);
}

export const fileUploadMiddleware = () => {
  return koaBodyMiddleware({
    multipart: true,
    formidable: {
      uploadDir: uploadErpLogsFolder, // Путь для сохранения файлов
      keepExtensions: true,
      onFileBegin: (name, file) => {
        if (name !== 'logFile') {
          throw new InvalidParameterException('Неверно указан параметр для файла');
        }

        if (!file.filepath || path.extname(file.filepath) !== '.txt') {
          throw new InvalidParameterException('Неверное расширение файла');
        }
      },
    },
  }) as any;
};
