import { Context, ParameterizedContext } from 'koa';

import { IDeviceLogParams, IUser } from '@lib/types';

import { deviceLogService } from '../services';

import { InvalidParameterException } from '../exceptions';

import { created, ok } from '../utils/apiHelpers';

const addDeviceLog = async (ctx: ParameterizedContext): Promise<void> => {
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
};

const getDeviceLog = async (ctx: ParameterizedContext): Promise<void> => {
  const { id } = ctx.params;

  const deviceLog = await deviceLogService.findOne(id);

  ok(ctx as Context, deviceLog, 'getDeviceLog: DeviceLog is successfully  received');
};

// const updateAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
//   const { id } = ctx.params;

//   const appSystemData = ctx.request.body as Partial<IAppSystem>;

//   const updatedAppSystem = appSystemService.updateOne(id, appSystemData);

//   ok(ctx as Context, updatedAppSystem,
//`updateAppSystem: appSystem '${updatedAppSystem.id}' is successfully updated`);
// };

// const removeAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
//   const { id } = ctx.params;

//   appSystemService.deleteOne(id);

//   ok(ctx as Context, undefined, `removeAppSystem: appSystem '${id}' is successfully removed`);
// };

const getDeviceLogs = async (ctx: ParameterizedContext): Promise<void> => {
  const deviceLogList = await deviceLogService.findMany();

  ok(ctx as Context, deviceLogList, 'getDeviceLogs: deviceLogs are successfully received');
};

export { addDeviceLog, getDeviceLogs, getDeviceLog };
