import { Context, ParameterizedContext } from 'koa';

import { IDeleteFilesRequest, IMoveFilesRequest, IPathParams } from '@lib/types';

import { fileService, fileUtils } from '../services';

import { notOk, ok, prepareParams } from '../utils';
import { InvalidParameterException } from '../exceptions';

const getFiles = async (ctx: ParameterizedContext): Promise<void> => {
  const params = prepareParams(
    ctx.query,
    [
      'companyId',
      'appSystemId',
      'fileName',
      'uid',
      'consumerId',
      'producerId',
      'deviceId',
      'filterText',
      'folder',
      'dateFrom',
      'dateTo',
      'mDateFrom',
      'mDateTo',
      'searchQuery',
    ],
    ['fromRecord', 'toRecord'],
  );

  const fileList = await fileService.findMany(params);

  ok(ctx as Context, fileList, 'getFiles: files are successfully received');
};

/**
 * Получение содержимого файла
   в зависимости от параметров запроса
 * @param ctx
 */
const getFileContent = async (ctx: ParameterizedContext): Promise<void> => {
  const params = await fileUtils.getFileParams(ctx.params, ctx.query);

  const fileContent = await fileService.getContent(params);

  ok(ctx as Context, fileContent, 'getFileContent: fileContent is successfully received');
};

const deleteFile = async (ctx: ParameterizedContext): Promise<void> => {
  const params = await fileUtils.getFileParams(ctx.params, ctx.query);

  await fileService.deleteOne(params);

  ok(ctx as Context, undefined, 'deleteFile: file is successfully deleted');
};

const deleteFiles = async (ctx: ParameterizedContext): Promise<void> => {
  const { files } = ctx.request.body as IDeleteFilesRequest;

  const deletedFiles = await fileService.deleteMany(files);

  const hasSuccess = deletedFiles.some((result) => result.success);

  if (hasSuccess) {
    // Если хотя бы один файл успешно удален, возвращаем список всех файлов со статусом удаления
    ok(ctx as Context, deletedFiles, 'deleteFiles: files are successfully deleted');
  } else {
    // Иначе возвращаем ошибку со списком файлов и описанием ошибки
    notOk(ctx as Context, 500, 'deleteFiles: files are not deleted', deletedFiles);
  }
};

const updateFile = async (ctx: ParameterizedContext): Promise<void> => {
  const params = await fileUtils.getFileParams(ctx.params, ctx.query);

  const data = ctx.request.body as string;

  const updatedFile = await fileService.updateOne(params, data);

  ok(ctx as Context, updatedFile, `updateFile: file '${params.id}' is successfully updated`);
};

const getFolders = async (ctx: ParameterizedContext): Promise<void> => {
  const params = prepareParams<IPathParams>(ctx.query, ['companyId', 'appSystemId']);

  const folderList = await fileService.getFolders(params);

  ok(ctx as Context, folderList, 'getFolders: folders is successfully  received');
};

const moveFiles = async (ctx: ParameterizedContext): Promise<void> => {
  const { files, toFolder } = ctx.request.body as IMoveFilesRequest;

  if (!toFolder) {
    throw new InvalidParameterException('Не указана папка для перемещения файлов');
  }

  const movedFiles = await fileService.moveMany(files, toFolder);

  const hasSuccess = movedFiles.some((result) => result.success);

  if (hasSuccess) {
    // Если хотя бы один файл успешно перемещен, возвращаем список всех файлов с результатом перемещения
    ok(ctx as Context, movedFiles, 'moveFiles: files are successfully moved');
  } else {
    // Иначе возвращаем ошибку со списком файлов и описанием ошибки
    notOk(ctx as Context, 500, 'moveFiles: files are not moved', movedFiles);
  }
};

export { getFiles, getFileContent, deleteFile, updateFile, deleteFiles, getFolders, moveFiles as moveFiles };
