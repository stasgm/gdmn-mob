import { unlink } from 'fs/promises';

import { Context, ParameterizedContext } from 'koa';

import { IErpLogFileRequest, IErpLogRequestBody } from '@lib/types';

import { created, ok } from '../utils/apiHelpers';
import { erpLogService } from '../services';
import { InvalidParameterException } from '../exceptions';
import log from '../utils/logger';
import { checkFileExists } from '../utils/fileHelper';

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
  const file = (ctx.request as unknown as IErpLogFileRequest).files.logFile;

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

    await erpLogService.addOne(companyId, appSystemId, file);
  } finally {
    await deleteTempFile(file.filepath);
  }

  created(
    ctx,
    undefined,
    `add erpLog: Log for companyId=${companyId} and appSystemId=${appSystemId} is successfully created`,
  );
};

const getErpLog = async (ctx: ParameterizedContext) => {
  const { companyId, appSystemId, start, end } = ctx.query;

  if (typeof companyId !== 'string') {
    throw new InvalidParameterException('Не указан идентификатор компании');
  }

  if (typeof appSystemId !== 'string') {
    throw new InvalidParameterException('Не указан идентификатор подсистемы');
  }

  if (typeof start !== 'number' || typeof end !== 'number') {
    throw new InvalidParameterException('Паметры start и end должны быть числами');
  }

  const serverLog = await erpLogService.findOne(companyId, appSystemId, start, end);

  ok(ctx as Context, serverLog, 'getErpLog: ERP log is successfully received');
};

export { addErpLog, getErpLog };
