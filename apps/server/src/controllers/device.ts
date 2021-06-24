import { Context, ParameterizedContext } from 'koa';

import { IDevice, IUser, NewDevice } from '@lib/types';

import log from '../utils/logger';
import { deviceService } from '../services';

import { created, ok } from '../utils/apiHelpers';

import { DataNotFoundException } from '../exceptions';

const addDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { name } = ctx.request.body as NewDevice;

  const { companies } = ctx.state.user as IUser;
  const company = companies[0];

  // console.log('companyId', companyId);

  const device: NewDevice = { name, company };

  // console.log('device', device);

  const newDevice = await deviceService.addOne(device);

  created(ctx as Context, newDevice);

  log.info(`add device: device '${name}' is successfully created'`);
};

// const addDevice = async (ctx: ParameterizedContext): Promise<void> => {
//   const { name, userId } = ctx.request.body;

//   const device: NewDevice = { name, userId };

//   const newDevice = await deviceService.addOne(device);

//   created(ctx as Context, newDevice);

//   log.info(`addDevice: device '${name}' is successfully created'`);
// };

const updateDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId } = ctx.params;
  const deviceData = ctx.request.body as Partial<IDevice>;

  const params: Record<string, string> = {};

  const { id: adminId } = ctx.state.user;

  params.adminId = adminId;

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
  const { companyId, uId, state } = ctx.query;

  const params: Record<string, string> = {};

  const { id: adminId } = ctx.state.user;

  if (typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (typeof uId === 'string') {
    params.uId = uId;
  }

  if (typeof state === 'string') {
    params.state = state;
  }

  if (typeof adminId === 'string') {
    params.adminId = adminId;
  }

  const deviceList = await deviceService.findAll(params);

  ok(ctx as Context, deviceList);

  log.info('getDevices: devises are successfully received');
};

// const getUsersByDevice = async (ctx: ParameterizedContext): Promise<void> => {
//   const { id: deviceId }: { id: string } = ctx.params;

//   const userList = await deviceService.findUsers(deviceId);

//   ok(ctx as Context, userList);

//   log.info('getUsersByDevice: user by device is successfully received');
// };

// const getDeviceByUser = async (ctx: ParameterizedContext): Promise<void> => {
//   const { id: deviceId, name }: { id: string; name: string } = ctx.params;

//   if (!deviceId) {
//     ctx.throw(400, 'не указан uid устройства');
//   }

//   if (!name) {
//     ctx.throw(400, 'не указано имя пользователя');
//   }

//   try {
//     const device = await deviceService.findOneByUidAndUser({
//       deviceId,
//       name,
//     });

//     if (!device) {
//       ctx.throw(404, 'Устройство не найдено');
//     }

//     const result: IResponse<IDevice> = { result: true, data: device };

//     ctx.status = 200;
//     ctx.body = result;

//     log.info('getDevice: OK');
//   } catch (err) {
//     ctx.throw(404, err.message);
//   }
// };
/* const getDeviceByCurrentUser = async (ctx: Context): Promise<void> => {
  const { id: deviceId }: { id: string } = ctx.params;
  const { id: userId }: { id: string } = ctx.state.user;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  try {
    const device = await deviceService.findOneByUidAndUser({ deviceId, userId });

    const result: IResponse<IDevice> = { result: true, data: device };

    ctx.status = 200;
    ctx.body = result;

    log.info(`getDevice: OK`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
}; */

/* const lockDevice = async (ctx: ParameterizedContext): Promise<void> => {
  if (ctx.isAuthenticated()) {
    const { uid, userId } = ctx.request.body;
    const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
    const idx = allDevices && allDevices.findIndex(device => device.uid === uid && device.user === userId);
    if (!allDevices || idx === undefined || idx < 0) {
      ctx.body = JSON.stringify({ status: 422, result: `the device(${uid}) is not assigned to the user(${userId})` });
      log.warn(`the device(${uid}) is not assigned to the user(${userId})`);
    } else {
      await writeFile(
        PATH_LOCAL_DB_DEVICES,
        JSON.stringify([
          ...allDevices.slice(0, idx),
          { uid, user: userId, blocked: true },
          ...allDevices.slice(idx + 1),
        ]),
      );
      ctx.body = JSON.stringify({ status: 200, result: 'device locked successfully' });
      log.info('device locked successfully');
    }
  } else {
    ctx.body = JSON.stringify({ status: 401, result: 'access denied' });
    log.warn('access denied');
  }
};

*/
export { addDevice, updateDevice, removeDevice, getDevice, getDevices };
