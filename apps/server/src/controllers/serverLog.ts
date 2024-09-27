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

const getServerInfo = async (ctx: ParameterizedContext): Promise<void> => {
  // Использование памяти процессом
  const memoryUsage = process.memoryUsage();
  // Использование CPU процессом
  const usage = process.cpuUsage();
  const cpuUsage = {
    user: `${usage.user / 1000} ms`,
    system: `${usage.system / 1000} ms`,
  };

  // Время работы приложения (uptime процесса)
  const processUptime = process.uptime();

  const days = Math.floor(processUptime / (60 * 60 * 24));
  const hours = Math.floor((processUptime % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((processUptime % (60 * 60)) / 60);
  const seconds = Math.floor(processUptime % 60);

  // Возвращаем информацию о приложении
  const serverInfo = {
    memoryUsage: memoryUsage,
    cpuUsage,
    processUptime: `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`,
  };

  ok(ctx as Context, serverInfo, 'getServerInfo: server memory are successfully received');
};

export { getServerLogs, getServerLog as getServerLog, deleteServerLog, deleteServerLogs, getServerInfo };
