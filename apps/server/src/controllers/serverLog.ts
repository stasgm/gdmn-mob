import { Context, ParameterizedContext } from 'koa';

import { IDeleteFilesRequest } from '@lib/types';

import { serverLogService } from '../services';

import { notOk, ok, prepareParams } from '../utils';
import { getFileParams, serverLogFolder } from '../services/fileUtils';

const getServerLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const params = prepareParams(ctx.query, ['dateFrom', 'dateTo', 'mDateFrom', 'mDateTo', 'filterText', 'searchQuery']);

  const serverLogList = await serverLogService.findMany(params);

  ok(ctx as Context, serverLogList, 'getServerLogs: serverLogs are successfully received');
};

const getServerLogContent = async (ctx: ParameterizedContext): Promise<void> => {
  const file = await getFileParams(ctx.params, ctx.query);
  file.folder = serverLogFolder;
  const params = prepareParams<Record<string, number>>(ctx.query, undefined, ['start', 'end']);

  const serverLog = await serverLogService.getContent(file, params);

  ok(ctx as Context, serverLog, 'getServerLog: ServerLog is successfully  received');
};

const deleteServerLog = async (ctx: ParameterizedContext): Promise<void> => {
  const file = await getFileParams(ctx.params, ctx.query);
  file.folder = serverLogFolder;

  await serverLogService.deleteOne(file);

  ok(ctx as Context, undefined, `deleteServerLog: '${ctx.params.id}' is successfully removed`);
};

const deleteServerLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const { files } = ctx.request.body as IDeleteFilesRequest;

  const deletedFiles = await serverLogService.deleteMany(files.map((file) => ({ ...file, folder: serverLogFolder })));

  const hasSuccess = deletedFiles.some((result) => result.success);

  if (hasSuccess) {
    // Если хотя бы один файл успешно удален, возвращаем список всех файлов со статусом удаления
    ok(ctx as Context, deletedFiles, 'deleteServerogs: files are successfully deleted');
  } else {
    // Иначе возвращаем ошибку со списком файлов и описанием ошибки
    notOk(ctx as Context, 500, 'deleteServerLogs: files are not deleted', deletedFiles);
  }
};

export { getServerLogs, getServerLogContent as getServerLog, deleteServerLog, deleteServerLogs };
