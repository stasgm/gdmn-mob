import { Context, ParameterizedContext } from 'koa';

import { IDeviceLogParams, IUser, IFileIds } from '@lib/types';

import { deviceLogService } from '../services';

import { InvalidParameterException } from '../exceptions';

import { created, ok } from '../utils/apiHelpers';

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

const getDeviceLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const params: Record<string, string | number> = {};

  const { uid, date, company, appSystem, contact, device, filterText, fromRecord, toRecord } = ctx.query;

  if (typeof company === 'string') {
    params.company = company;
  }

  if (typeof contact === 'string') {
    params.contact = contact;
  }

  if (typeof uid === 'string') {
    params.uid = uid;
  }

  if (typeof date === 'string') {
    params.date = date;
  }

  if (typeof appSystem === 'string') {
    params.appSystem = appSystem;
  }

  if (typeof device === 'string') {
    params.device = device;
  }

  if (typeof filterText === 'string') {
    params.filterText = filterText;
  }

  if (typeof fromRecord === 'string' && isFinite(Number(fromRecord))) {
    params.fromRecord = Number(fromRecord);
  }

  if (typeof toRecord === 'string' && isFinite(Number(toRecord))) {
    params.toRecord = Number(toRecord);
  }

  const deviceLogList = await deviceLogService.findMany(params);

  ok(ctx as Context, deviceLogList, 'getDeviceLogs: deviceLogs are successfully received');
};

export { addDeviceLog, getDeviceLogs, getDeviceLog, removeDeviceLog };
