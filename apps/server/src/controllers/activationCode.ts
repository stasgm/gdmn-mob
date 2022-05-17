import { Context, Next, ParameterizedContext } from 'koa';

import { activationCodeService } from '../services';

import { created, ok } from '../utils/apiHelpers';

const getActivationCodes = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { deviceId } = ctx.query;

  const params: Record<string, string> = {};

  if (typeof deviceId === 'string') {
    params.deviceId = deviceId;
  }

  const codeList = activationCodeService.findMany(params);

  ok(ctx as Context, codeList, 'getActivationCodes: activation codes are successfully received');

  return next();
};

const getActivationCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceId } = ctx.params;

  const code = activationCodeService.genActivationCode(deviceId);

  created(ctx as Context, code, 'getActivationCode: activation code generated successfully');
};

export { getActivationCodes, getActivationCode };
