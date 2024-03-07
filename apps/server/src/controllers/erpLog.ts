import { unlink } from 'fs/promises';

import { Context, ParameterizedContext } from 'koa';

import { IErpLogFileAddRequest, IErpLogRequestBody, IPathParams } from '@lib/types';

import { log, created, ok, checkFileExists, prepareParams } from '../utils';
import { erpLogService, fileUtils } from '../services';
import { InvalidParameterException } from '../exceptions';

const deleteTempFile = async (filepath: string) => {
  try {
    if (await checkFileExists(filepath)) {
      await unlink(filepath);
    }
  } catch (err) {
    log.error('Ошибка при удалении временного файла:', err);
  }
};

const addErpLog = async (ctx: Context) => {
  const { companyId, appSystemId } = ctx.request.body as IErpLogRequestBody;
  const file = (ctx.request as unknown as IErpLogFileAddRequest).files.logFile;

  if (!file || !file.filepath) {
    throw new InvalidParameterException('Не указан файл');
  }

  //В случае ошибки, удаляем временный файл
  try {
    if (typeof companyId !== 'string') {
      throw new InvalidParameterException('Не указан идентификатор компании');
    }

    if (typeof appSystemId !== 'string') {
      throw new InvalidParameterException('Не указан идентификатор подсистемы');
    }

    const params = prepareParams<IPathParams>(ctx.query, ['companyId', 'appSystemId']);

    await erpLogService.addOne(params, file);
  } finally {
    await deleteTempFile(file.filepath);
  }

  created(
    ctx,
    undefined,
    `add erpLog: Log for companyId=${companyId} and appSystemId=${appSystemId} is successfully created`,
  );
};

const getErpLogContent = async (ctx: ParameterizedContext) => {
  const params = await fileUtils.getFileParams(ctx.params, ctx.query);

  const serverLog = await erpLogService.getContent(params);

  ok(
    ctx as Context,
    serverLog,
    `getErpLog: Log for companyId=${params.companyId} and appSystemId=${params.appSystemId} is successfully received`,
  );
};

export { addErpLog, getErpLogContent as getErpLog };
