import { Context, ParameterizedContext } from 'koa';

import { IDeviceLogParams, IUser, IFileIds } from '@lib/types';

import { deviceLogService } from '../services';

import { InvalidParameterException } from '../exceptions';

import { created, ok } from '../utils/apiHelpers';
import { processNumberFields, processStringFields } from '../utils/helpers';

const addDeviceLog = async (ctx: ParameterizedContext): Promise<void> => {
  const { action } = ctx.query;

  // Добавление Лога
  if (!action || action !== 'delete') {
    const { appVersion, appSettings, deviceLog, companyId, appSystemId } = ctx.request.body as IDeviceLogParams;
    const deviceId = ctx.query.deviceId;
    const user = ctx.state.user as IUser;

    if (typeof deviceId !== 'string') {
      throw new InvalidParameterException('Идентификатор устройства неверного типа');
    }

    deviceLogService.addOne({
      appVersion: appVersion || '',
      appSettings: appSettings || {},
      deviceLog,
      producerId: user.id,
      appSystemId,
      companyId,
      deviceId,
    });

    created(ctx as Context, undefined, `add deviceLog: DeviceLog for device uid=${deviceId} is successfully created`);
    return;
  }
  // Удаление нескольких логов
  const { ids } = ctx.request.body as IFileIds;

  await deviceLogService.deleteMany(ids);

  ok(ctx as Context, undefined, 'removeManyFiles: files are successfully  deleted');
};

const getDeviceLog = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;

  const deviceLog = await deviceLogService.findOne(id);

  ok(ctx as Context, deviceLog, 'getDeviceLog: DeviceLog is successfully  received');
};

const removeDeviceLog = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;

  await deviceLogService.deleteOne(id);

  ok(ctx as Context, undefined, `removeDeviceLog: DeviceLog '${id}' is successfully removed`);
};

const getDeviceLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const stringFields: string[] = ['company', 'contact', 'uid', 'date', 'appSystem', 'device', 'filterText'];
  const numberFields: string[] = ['fromRecord', 'toRecord'];

  const params: Record<string, string | number> = {};

  processStringFields(params, ctx.query, stringFields);
  processNumberFields(params, ctx.query, numberFields);

  const deviceLogList = await deviceLogService.findMany(params);

  ok(ctx as Context, deviceLogList, 'getDeviceLogs: deviceLogs are successfully received');
};

export { addDeviceLog, getDeviceLogs, getDeviceLog, removeDeviceLog };
