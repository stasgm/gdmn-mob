import { ParameterizedContext } from 'koa';
import log from '../utils/logger';
import { IDevice, IResponse, IDeviceInfo } from '../../../common';
import { deviceService } from '../services';

const getDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId }: { id: string } = ctx.params;
  // const { userId }: { userId: string } = ctx.request.body;

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

    log.info(`getDevice: OK`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getDeviceByUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId, userName }: { id: string; userName: string } = ctx.params;

  if (!deviceId) {
    ctx.throw(400, 'не указан uid устройства');
  }

  if (!userName) {
    ctx.throw(400, 'не указано имя пользователя');
  }

  try {
    const device = await deviceService.findOneByUidAndUser({ deviceId, userName });

    if (!device) {
      ctx.throw(404, 'устройство не найдено');
    }

    const result: IResponse<IDevice> = { result: true, data: device };

    ctx.status = 200;
    ctx.body = result;

    log.info(`getDevice: OK`);
  } catch (err) {
    ctx.throw(404, err.message);
  }
};

const getDevices = async (ctx: ParameterizedContext): Promise<void> => {
  try {
    const deviceList = await deviceService.findAll();

    const result: IResponse<IDevice[]> = { result: true, data: deviceList };

    ctx.status = 200;
    ctx.body = result;

    log.info(`getDevices: OK`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

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

const addDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceName, userId } = ctx.request.body;

  if (!deviceName) {
    ctx.throw(400, 'не указано наименование устройства');
  }

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  try {
    const id = await deviceService.addOne({ deviceName, userId });

    const result: IResponse<string> = { result: true, data: id };

    ctx.status = 201;
    ctx.body = result;

    log.info(`addDevice: OK`);
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
    const userList = ((await deviceService.findUsers(deviceId)) as unknown) as IDeviceInfo[];

    const result: IResponse<IDeviceInfo[]> = { result: true, data: userList };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUsersByDevice: ok');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const updateDevice = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: deviceId } = ctx.params;
  const deviceInfo = ctx.request.body as Partial<IDevice>;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  if (!deviceInfo) {
    ctx.throw(400, 'не указана информация об устройстве');
  }

  const oldDevice = await deviceService.findOne(deviceId); //devices.find(i => i.id === device.id);

  if (!oldDevice) {
    ctx.throw(400, 'устройство не найдено');
  }

  // Удаляем поля которые нельзя перезаписывать
  delete deviceInfo.userId;
  delete deviceInfo.id;
  //deviceInfo.userId = '';
  //deviceInfo.id = undefined;

  try {
    const id = await deviceService.updateOne({ ...oldDevice, ...deviceInfo, uid: deviceId });

    const result: IResponse<string> = { result: true, data: id };

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
    ctx.body = result; //TODO передавать только код 204 без body

    log.info('updateDevice: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

/*const lockDevice = async (ctx: ParameterizedContext): Promise<void> => {
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
export { getDevice, getDevices, getUsersByDevice, addDevice, updateDevice, removeDevice, getDeviceByUser };
