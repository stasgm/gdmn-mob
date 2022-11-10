import { Context, ParameterizedContext } from 'koa';

import { IAppSystem, IDeviceLogParams, IUser, NewAppSystem } from '@lib/types';

import { deviceLogService } from '../services';

import { DataNotFoundException, InvalidParameterException } from '../exceptions';

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

// const getAppSystems = async (ctx: ParameterizedContext): Promise<void> => {
//   const { appSystemId, name, filterText, fromRecord, toRecord } = ctx.query;

//   const params: Record<string, string> = {};

//   if (appSystemId && typeof appSystemId === 'string') {
//     params.appSystemId = appSystemId;
//   }

//   if (name && typeof name === 'string') {
//     params.name = name;
//   }

//   if (typeof filterText === 'string') {
//     params.filterText = filterText;
//   }

//   if (typeof fromRecord === 'string') {
//     params.fromRecord = fromRecord;
//   }

//   if (typeof toRecord === 'string') {
//     params.toRecord = toRecord;
//   }

//   const appSystemList = appSystemService.findMany(params);

//   ok(ctx as Context, appSystemList, 'getAppSystem: app systems are successfully received');
// };

// const getAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
//   const { id } = ctx.params;

//   const appSystem = appSystemService.findOne(id);

//   if (!appSystem) {
//     throw new DataNotFoundException('Подсистема не найдена');
//   }

//   ok(ctx as Context, appSystem, `getAppSystem: appSystem '${appSystem.name}' is successfully received`);
// };

export { addDeviceLog };
