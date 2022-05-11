import { Context, ParameterizedContext } from 'koa';

import { IDeviceBinding, NewDeviceBinding } from '@lib/types';

import { deviceBindingService } from '../services';

import { created, ok } from '../utils/apiHelpers';
import { DataNotFoundException } from '../exceptions';

const addDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { device, user, state } = ctx.request.body as NewDeviceBinding;

  const newDeviceBinding = await deviceBindingService.addOne({ device, user, state });

  created(ctx as Context, newDeviceBinding, 'addDeviceBinding: deviceBinding is successfully created');
};

const updateDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceBindingId } = ctx.params;

  const deviceBindingData = ctx.request.body as Partial<IDeviceBinding>;

  const updatedDeviceBinding = await deviceBindingService.updateOne(deviceBindingId, deviceBindingData);

  ok(ctx as Context, updatedDeviceBinding, 'updateDevice: deviceBinding is successfully updated');
};

const removeDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { id }: { id: string } = ctx.params;

  await deviceBindingService.deleteOne({ deviceBindingId: id });

  ok(ctx as Context, undefined, `removeDevice: device '${id}' is successfully removed `);

  // TODO передавать только код 204 без body
};

const getDeviceBinding = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceBindingId }: { id: string } = ctx.params;

  const deviceBinding = await deviceBindingService.findOne(deviceBindingId);

  if (!deviceBinding) {
    throw new DataNotFoundException('Связь с устройством не определена');
  }

  ok(ctx as Context, deviceBinding, 'getDeviceBinding: deviceBinding is successfully received');
};

const getDeviceBindings = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceId, companyId, userId, state, filterText, fromRecord, toRecord } = ctx.query;

  const params: Record<string, string> = {};

  if (companyId && typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (typeof deviceId === 'string') {
    params.deviceId = deviceId;
  }

  if (typeof userId === 'string') {
    params.userId = userId;
  }

  if (typeof state === 'string') {
    params.state = state;
  }

  if (typeof filterText === 'string') {
    params.filterText = filterText;
  }

  if (typeof fromRecord === 'string') {
    params.fromRecord = fromRecord;
  }

  if (typeof toRecord === 'string') {
    params.toRecord = toRecord;
  }

  const deviceBindingList = await deviceBindingService.findAll(params);

  ok(ctx as Context, deviceBindingList, 'getDeviceBindings: deviseBindings are successfully received');
};

export { addDeviceBinding, updateDeviceBinding, removeDeviceBinding, getDeviceBinding, getDeviceBindings };
