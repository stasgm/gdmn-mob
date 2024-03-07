/* eslint-disable no-await-in-loop */
import { unlink, readdir } from 'fs/promises';
import path from 'path';

import { Context, ParameterizedContext } from 'koa';

import { IErpLogFileAddRequest, IErpLogRequestBody, IPathParams } from '@lib/types';

import { log, created, ok, prepareParams } from '../utils';
import { erpLogService, fileUtils } from '../services';
import { InvalidParameterException } from '../exceptions';
import { uploadErpLogsFolder } from '../services/fileUtils';

const deleteAllTempFiles = async (folderPath: string) => {
  try {
    const files = await readdir(folderPath);
    for (const file of files) {
      await unlink(path.join(folderPath, file));
    }
  } catch (err) {
    log.error('Ошибка при удалении временных erp-логов:', err);
  }
};

const addErpLog = async (ctx: Context) => {
  const { companyId, appSystemId } = ctx.request.body as IErpLogRequestBody;

  const file = (ctx.request as unknown as IErpLogFileAddRequest).files.logFile;
  //ПО окончанию удаляем временные файлы
  try {
    if (!file || !file.filepath) {
      throw new InvalidParameterException('Не указан файл');
    }

    if (typeof companyId !== 'string') {
      throw new InvalidParameterException('Не указан идентификатор компании');
    }

    if (typeof appSystemId !== 'string') {
      throw new InvalidParameterException('Не указан идентификатор подсистемы');
    }

    const params = prepareParams<IPathParams>(ctx.request.body as IErpLogRequestBody, ['companyId', 'appSystemId']);

    await erpLogService.addOne(params, file);
  } finally {
    await deleteAllTempFiles(uploadErpLogsFolder);
  }

  created(
    ctx,
    undefined,
    `add erpLog: Log for companyId=${companyId} and appSystemId=${appSystemId} is successfully created`,
  );
};

const getErpLogContent = async (ctx: ParameterizedContext) => {
  const params = fileUtils.prepareFileParams(ctx.params.id, ctx.query);

  const serverLog = await erpLogService.getContent(params);

  ok(
    ctx as Context,
    serverLog,
    `getErpLog: Log for companyId=${params.companyId} and appSystemId=${params.appSystemId} is successfully received`,
  );
};

export { addErpLog, getErpLogContent };
