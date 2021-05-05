import { ParameterizedContext } from 'koa';

import { IDevice, IResponse, NewDevice } from '@lib/types';

import log from '../utils/logger';
import { deviceService } from '../services';

const addDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceName, userId } = ctx.request.body;

  if (!deviceName) {
    ctx.throw(400, 'не указано наименование устройства');
  }

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  const device: NewDevice = {
    name: deviceName,
    userId,
  };

  try {
    const newDevice = await deviceService.addOne(device);

    const result: IResponse<IDevice> = { result: true, data: newDevice };

    ctx.status = 201;
    ctx.body = result;

    log.info('addDevice: OK');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const updateDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId } = ctx.params;
  const deviceData = ctx.request.body as Partial<IDevice>;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  if (!deviceData) {
    ctx.throw(400, 'не указана информация об устройстве');
  }

  try {
    const updatedDevice = await deviceService.updateOne(deviceId, deviceData);

    const result: IResponse<IDevice> = { result: true, data: updatedDevice };

    ctx.status = 200;
    ctx.body = result;

    log.info('updateDevice: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const removeDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId } = ctx.params;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  try {
    await deviceService.deleteOne({ deviceId });

    const result: IResponse<void> = { result: true };

    ctx.status = 200;
    ctx.body = result; // TODO передавать только код 204 без body

    log.info('updateDevice: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const getDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId }: { id: string } = ctx.params;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  try {
    const device = await deviceService.findOneByUid(deviceId);

    if (!device) {
      ctx.throw(404, 'устройство не найдено');
    }

    const result: IResponse<IDevice> = { result: true, data: device };

    ctx.status = 200;
    ctx.body = result;

    log.info('getDevice: OK');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getDevices = async (ctx: ParameterizedContext): Promise<void> => {
  console.log(ctx.query);
  const { userId } = ctx.query;
  console.log(userId);

  const params: Record<string, string> = {};

  if (typeof userId === 'string') {
    params.userId = userId;
  }

  try {
    const deviceList = await deviceService.findAll(params);

    const result: IResponse<IDevice[]> = { result: true, data: deviceList };

    ctx.status = 200;
    ctx.body = result;

    log.info('getDevices: OK');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getUsersByDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId }: { id: string } = ctx.params;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  try {
    const userList = await deviceService.findUsers(deviceId);

    const result: IResponse<IDevice[]> = { result: true, data: userList };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUsersByDevice: ok');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

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
//       ctx.throw(404, 'устройство не найдено');
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
export { addDevice, updateDevice, removeDevice, getDevice, getDevices, getUsersByDevice };
