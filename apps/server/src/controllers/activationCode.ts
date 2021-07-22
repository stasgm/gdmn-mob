import { Context, ParameterizedContext } from 'koa';

import { INamedEntity, IActivationCode } from '@lib/types';

import log from '../utils/logger';
import { activationCodeService } from '../services';

import { created, ok } from '../utils/apiHelpers';

import { DataNotFoundException } from '../exceptions';

// const getDevice = async (ctx: ParameterizedContext): Promise<void> => {
//   const { id: deviceId }: { id: string } = ctx.params;

//   const device = await deviceService.findOne(deviceId);

//   if (!device) {
//     throw new DataNotFoundException('Устройство не найдено');
//   }

//   ok(ctx as Context, device);

//   log.info(`getDevice: device '${device.name}' is successfully received`);
// };

const getActivationCodes = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceId } = ctx.query;

  const params: Record<string, string> = {};

  if (typeof deviceId === 'string') {
    params.deviceId = deviceId;
  }

  const codeList = await activationCodeService.findAll(params);

  ok(ctx as Context, codeList);

  log.info('getActivationCodes: activation codes are successfully received');
};

export { getActivationCodes };
