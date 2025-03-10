import { Context, ParameterizedContext } from 'koa';

import { IDeviceBinding, NewDeviceBinding } from '@lib/types';

import { deviceBindingService } from '../services';

import { created, ok, prepareParams } from '../utils';
import { DataNotFoundException } from '../exceptions';

const addDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { device, user, state } = ctx.request.body as NewDeviceBinding;

  const newDeviceBinding = deviceBindingService.addOne({ device, user, state });

  created(ctx as Context, newDeviceBinding, 'addDeviceBinding: deviceBinding is successfully created');
};

const updateDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceBindingId } = ctx.params;

  const deviceBindingData = ctx.request.body as Partial<IDeviceBinding>;

  const updatedDeviceBinding = deviceBindingService.updateOne(deviceBindingId, deviceBindingData);

  ok(ctx as Context, updatedDeviceBinding, 'updateDevice: deviceBinding is successfully updated');
};

const removeDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceBindingId } = ctx.params;

  deviceBindingService.deleteOne(deviceBindingId);

  ok(ctx as Context, undefined, `removeDeviceBinding: deviceBinding '${deviceBindingId}' is successfully removed `);
};

const getDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceBindingId } = ctx.params;

  const deviceBinding = deviceBindingService.findOne(deviceBindingId);

  if (!deviceBinding) {
    throw new DataNotFoundException('Связь с устройством не определена');
  }

  ok(ctx as Context, deviceBinding, 'getDeviceBinding: deviceBinding is successfully received');
};

const getDeviceBindings = async (ctx: ParameterizedContext): Promise<void> => {
  const params = prepareParams(
    ctx.query,
    ['companyId', 'deviceId', 'userId', 'state', 'filterText'],
    ['fromRecord', 'toRecord'],
  );

  const deviceBindingList = deviceBindingService.findMany(params);

  ok(ctx as Context, deviceBindingList, 'getDeviceBindings: deviseBindings are successfully received');
};

export { addDeviceBinding, updateDeviceBinding, removeDeviceBinding, getDeviceBinding, getDeviceBindings };
