import { ParameterizedContext } from 'koa';

import { IResponse, IUser, IDBDevice } from '@lib/types';

import log from '../utils/logger';
import { userService } from '../services';

const getUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  try {
    const user = await userService.findOne(userId);

    if (!user) {
      ctx.throw(404, 'пользователь не найден');
    }

    const result: IResponse<IUser> = {
      result: true,
      data: user,
    };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUser: OK');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getUsers = async (ctx: ParameterizedContext): Promise<void> => {
  try {
    const users = await userService.findAll();

    const result: IResponse<IUser[]> = { result: true, data: users };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUsers: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const updateUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;
  const userData = ctx.request.body as Partial<IUser & { password: string }>;

  if (!userId) {
    ctx.throw(400, 'Не указан идентификатор пользователя');
  }

  if (!userData) {
    ctx.throw(400, 'Не указаны данные пользователя');
  }

  try {
    const updatedUser = await userService.updateOne(userId, userData);

    const result: IResponse<IUser> = { result: true, data: updatedUser };

    ctx.status = 200;
    ctx.body = result;

    log.info('updateUser: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const removeUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;

  if (!userId) {
    ctx.throw(400, 'Не указан идентификатор пользователя');
  }

  // TODO пользовате
  try {
    await userService.deleteOne(userId);

    const result: IResponse<void> = { result: true };

    ctx.status = 200;
    ctx.body = result; // TODO передавать только код 204 без body

    log.info('removeUser: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

const getDevicesByUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: userId } = ctx.params;

  if (!userId) {
    ctx.throw(400, 'не указан идентификатор пользователя');
  }

  try {
    const deviceIfno = ((await userService.findDevices(userId)) as unknown) as IDBDevice[];

    const result: IResponse<IDBDevice[]> = { result: true, data: deviceIfno };

    ctx.status = 200;
    ctx.body = result;

    log.info('getDevicesByUser: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

export { getDevicesByUser, getUsers, getUser, removeUser, updateUser };
