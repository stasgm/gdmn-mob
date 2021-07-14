import { Context, ParameterizedContext } from 'koa';

import { IDeviceBinding, NewDeviceBinding } from '@lib/types';

import log from '../utils/logger';
import { deviceBindingService } from '../services';

import { created, ok } from '../utils/apiHelpers';
import { DataNotFoundException } from '../exceptions';

const addDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { device, user, state } = ctx.request.body as NewDeviceBinding;

  const newDeviceBinding = await deviceBindingService.addOne({ device, user, state });

  created(ctx as Context, newDeviceBinding);

  log.info('addDeviceBinding: deviceBinding is successfully created');
};

const updateDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceBindingId } = ctx.params;
  const { companyId } = ctx.query;

  const deviceBindingData = ctx.request.body as Partial<IDeviceBinding>;

  const params: Record<string, string> = {};

  if (companyId && typeof companyId === 'string') {
    params.companyId = companyId;
  }

  const updatedDeviceBinding = await deviceBindingService.updateOne(deviceBindingId, deviceBindingData, params);

  ok(ctx as Context, updatedDeviceBinding);

  log.info('updateDevice: deviceBinding is successfully updated');
};

const removeDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { id }: { id: string } = ctx.params;

  /*
    const { companyId } = ctx.query;

    const params: Record<string, string> = {};

    if (companyId && typeof companyId === 'string') {
      params.companyId = companyId;
    } */

  await deviceBindingService.deleteOne({ deviceBindingId: id });

  ok(ctx as Context);

  // TODO передавать только код 204 без body

  log.info(`removeDevice: device '${id}' is successfully removed `);
};

const getDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceBindingId }: { id: string } = ctx.params;

  const deviceBinding = await deviceBindingService.findOne(deviceBindingId);

  if (!deviceBinding) {
    throw new DataNotFoundException('Связь с устройством не определена');
  }

  ok(ctx as Context, deviceBinding);

  log.info('getDeviceBinding: deviceBinding is successfully received');
};

const getDeviceBindings = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceId, companyId, state } = ctx.query;

  const params: Record<string, string> = {};

  if (companyId && typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (typeof deviceId === 'string') {
    params.deviceId = deviceId;
  }

  if (typeof state === 'string') {
    params.state = state;
  }

  const deviceBindingList = await deviceBindingService.findAll(params);

  ok(ctx as Context, deviceBindingList);

  log.info('getDeviceBindings: deviseBindings are successfully received');
};

export { addDeviceBinding, updateDeviceBinding, removeDeviceBinding, getDeviceBinding, getDeviceBindings };
