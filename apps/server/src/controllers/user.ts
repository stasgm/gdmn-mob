import { ParameterizedContext } from 'koa';

import { IDevice, IResponse, IUser, NewUser } from '@lib/types';

import log from '../utils/logger';
import { userService } from '../services';

const addUser = async (ctx: ParameterizedContext): Promise<void> => {
  const { externalId, name, password, firstName, lastName, phoneNumber, companies, creator } = ctx.request
    .body as NewUser;

  if (!name) {
    ctx.throw(400, 'Не указано имя пользователя');
  }

  if (!password) {
    ctx.throw(400, 'Не указан пароль');
  }

  const user: NewUser = {
    externalId,
    password,
    name,
    firstName,
    lastName,
    phoneNumber,
    companies: companies || [],
    creator,
  };

  try {
    const newUser = await userService.addOne(user);

    const result: IResponse<IUser> = { result: true, data: newUser };

    ctx.status = 200;
    ctx.body = result;

    log.info(`signUp: user '${name}' is successfully signed up`);
  } catch (err) {
    ctx.throw(400, err.message);
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
  const { companyId, name } = ctx.query;

  const params: Record<string, string> = {};

  if (typeof companyId === 'string') {
    params.companyId = companyId;
  }

  if (typeof name === 'string') {
    params.name = name;
  }

  try {
    const users = await userService.findAll(params);

    const result: IResponse<IUser[]> = { result: true, data: users };

    ctx.status = 200;
    ctx.body = result;

    log.info('getUsers: OK');
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
    const deviceIfno = await userService.findDevices(userId);

    const result: IResponse<IDevice[]> = { result: true, data: deviceIfno };

    ctx.status = 200;
    ctx.body = result;

    log.info('getDevicesByUser: OK');
  } catch (err) {
    ctx.throw(400, err);
  }
};

export { addUser, getUsers, getUser, removeUser, updateUser, getDevicesByUser };
