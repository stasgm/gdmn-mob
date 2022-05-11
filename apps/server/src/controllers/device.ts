import { Context, ParameterizedContext } from 'koa';

import { IDevice, INamedEntity, NewDevice } from '@lib/types';

import log from '../utils/logger';
import { deviceService } from '../services';

import { created, ok } from '../utils/apiHelpers';

import { DataNotFoundException } from '../exceptions';

const addDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, state } = ctx.request.body as NewDevice;

  const company = ctx.state.user.company as INamedEntity;

  const newDevice = await deviceService.addOne({ name, company, state });

  created(ctx as Context, newDevice);

  log.info(`add device: device '${name}' is successfully created'`);
};

const updateDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId } = ctx.params;
  const deviceData = ctx.request.body as Partial<IDevice>;

  const params: Record<string, string> = {};

  params.adminId = ctx.state.user.id;

  const updatedDevice = await deviceService.updateOne(deviceId, deviceData, params);

  ok(ctx as Context, updatedDevice);

  log.info(`updateDevice: device '${updatedDevice.name}' is successfully updated`);
};

const removeDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId } = ctx.params;

  await deviceService.deleteOne({ deviceId });

  ok(ctx as Context);

  // TODO передавать только код 204 без body

  log.info(`removeDevice: device '${deviceId}' is successfully removed `);
};

const getDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId }: { id: string } = ctx.params;

  const device = await deviceService.findOne(deviceId);

  if (!device) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  ok(ctx as Context, device);

  log.info(`getDevice: device '${device.name}' is successfully received`);
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

  const deviceList = await deviceService.findAll(params);

  ok(ctx as Context, deviceList);

  log.info('getDevices: devises are successfully received');
};

export { addDevice, updateDevice, removeDevice, getDevice, getDevices };
