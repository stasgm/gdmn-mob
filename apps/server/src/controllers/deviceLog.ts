import { Context, ParameterizedContext } from 'koa';

import { IDeviceLogParams, IUser, IFileIds } from '@lib/types';

import { deviceLogService } from '../services';

import { InvalidParameterException } from '../exceptions';

import { created, ok, notOk } from '../utils/apiHelpers';

const addDeviceLog = async (ctx: ParameterizedContext): Promise<void> => {
  const { action } = ctx.query;

  // Добавление Лога
  if (!action || action !== 'delete') {
    const { deviceLog, companyId, appSystemId } = ctx.request.body as IDeviceLogParams;
    const deviceId = ctx.query.deviceId;
    const user = ctx.state.user as IUser;

    if (typeof deviceId !== 'string') {
      throw new InvalidParameterException('Идентификатор устройства неверного типа');
    }

    deviceLogService.addOne({
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

const removeManyDeviceLog = async (ctx: ParameterizedContext): Promise<void> => {
  const { action } = ctx.query;

  if (!action || action !== 'delete') {
    notOk(ctx as Context);
    return;
  }
  const { ids } = ctx.request.body as IFileIds;

  await deviceLogService.deleteMany(ids);

  ok(ctx as Context, undefined, 'removeManyFiles: files are successfully  deleted');
};

const getDeviceLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const deviceLogList = await deviceLogService.findMany();

  ok(ctx as Context, deviceLogList, 'getDeviceLogs: deviceLogs are successfully received');
};

export { addDeviceLog, getDeviceLogs, getDeviceLog, removeDeviceLog, removeManyDeviceLog };
