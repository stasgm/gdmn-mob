import { Context, ParameterizedContext } from 'koa';

import log from '../utils/logger';
import { appSystemService } from '../services';

import { /*created,*/ ok } from '../utils/apiHelpers';

// const getDevice = async (ctx: ParameterizedContext): Promise<void> => {
//   const { id: deviceId }: { id: string } = ctx.params;

//   const device = await deviceService.findOne(deviceId);

//   if (!device) {
//     throw new DataNotFoundException('Устройство не найдено');
//   }

//   ok(ctx as Context, device);

//   log.info(`getDevice: device '${device.name}' is successfully received`);
// };

const getAppSystems = async (ctx: ParameterizedContext): Promise<void> => {
  const { appSystemId, name } = ctx.query;

  const params: Record<string, string> = {};

  // if (typeof deviceId === 'string') {
  //   params.deviceId = deviceId;
  // }

  if (appSystemId && typeof appSystemId === 'string') {
    params.appSystemId = appSystemId;
  }

  if (name && typeof name === 'string') {
    params.name = name;
  }

  const appSystemList = await appSystemService.findAll(params);

  ok(ctx as Context, appSystemList);

  log.info('getAppSystem: app systems are successfully received');
};

// const getAppSystem = async (ctx: ParameterizedContext): Promise<void> => {
//   const { deviceId } = ctx.params;

//   const code = await activationCodeService.genActivationCode(deviceId);

//   created(ctx as Context, code);

//   log.info('getActivationCode: activation code generated successfully');
// };

export { /*getAppSystem,*/ getAppSystems };
