import { Context, ParameterizedContext } from 'koa';

import { IDeleteFilesRequest } from '@lib/types';

import { serverLogService } from '../services';

import { notOk, ok, prepareParams } from '../utils';
import { prepareFileParams, serverLogPath } from '../services/fileUtils';

const getServerLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const params = prepareParams(ctx.query, ['dateFrom', 'dateTo', 'mDateFrom', 'mDateTo', 'filterText', 'searchQuery']);

  const serverLogList = await serverLogService.findMany(params);

  ok(ctx as Context, serverLogList, 'getServerLogs: serverLogs are successfully received');
};

const getServerLog = async (ctx: ParameterizedContext): Promise<void> => {
  const file = prepareFileParams(ctx.params.id, ctx.query);
  file.folder = serverLogPath;

  const serverLog = await serverLogService.getOne(file);

  ok(ctx as Context, serverLog, 'getServerLog: ServerLog is successfully  received');
};

const deleteServerLog = async (ctx: ParameterizedContext): Promise<void> => {
  const file = prepareFileParams(ctx.params.id, ctx.query);
  file.folder = serverLogPath;

  await serverLogService.deleteOne(file);

  ok(ctx as Context, undefined, `deleteServerLog: '${ctx.params.id}' is successfully removed`);
};

const deleteServerLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const { files } = ctx.request.body as IDeleteFilesRequest;

  const deletedFiles = await serverLogService.deleteMany(files.map((file) => ({ ...file, folder: serverLogPath })));

  const hasSuccess = deletedFiles.some((result) => result.success);

  if (hasSuccess) {
    // Если хотя бы один файл успешно удален, возвращаем список всех файлов со статусом удаления
    ok(ctx as Context, deletedFiles, 'deleteServerogs: files are successfully deleted');
  } else {
    // Иначе возвращаем ошибку со списком файлов и описанием ошибки
    notOk(ctx as Context, 500, 'deleteServerLogs: files are not deleted', deletedFiles);
  }
};

export { getServerLogs, getServerLog as getServerLog, deleteServerLog, deleteServerLogs };
