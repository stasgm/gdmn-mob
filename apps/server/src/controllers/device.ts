import { Context, ParameterizedContext } from 'koa';

import { IDevice, INamedEntity, NewDevice } from '@lib/types';

import { deviceService } from '../services';

import { created, ok } from '../utils/apiHelpers';

import { DataNotFoundException } from '../exceptions';

const addDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, state, company: newCompany } = ctx.request.body as NewDevice;

  const company = newCompany ? newCompany : (ctx.state.user.company as INamedEntity);

  const newDevice = deviceService.addOne({ name, company, state });

  created(ctx as Context, newDevice, `add device: device '${name}' is successfully created'`);
};

const updateDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId } = ctx.params;
  const deviceData = ctx.request.body as Partial<IDevice>;

  const params: Record<string, string> = {};

  params.adminId = ctx.state.user.id;

  const updatedDevice = deviceService.updateOne(deviceId, deviceData, params);

  ok(ctx as Context, updatedDevice, `updateDevice: device '${updatedDevice.name}' is successfully updated`);
};

const removeDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId } = ctx.params;

  deviceService.deleteOne(deviceId);

  ok(ctx as Context, undefined, `removeDevice: device '${deviceId}' is successfully removed `);
};

const getDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId }: { id: string } = ctx.params;

  const device = deviceService.findOne(deviceId);

  if (!device) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  ok(ctx as Context, device, `getDevice: device '${device.name}' ('${device.uid}') is successfully received`);
};

const getDevices = async (ctx: ParameterizedContext): Promise<void> => {
  const { companyId, uid, state, filterText, fromRecord, toRecord } = ctx.query;

  const params: Record<string, string | number> = {};

  if (typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (typeof uid === 'string') {
    params.uid = uid;
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

  const deviceList = deviceService.findMany(params);

  ok(ctx as Context, deviceList, 'getDevices: devises are successfully received');
};

export { addDevice, updateDevice, removeDevice, getDevice, getDevices };
