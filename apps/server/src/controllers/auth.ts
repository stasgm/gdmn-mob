import { ParameterizedContext, Next, Context } from 'koa';

import { IResponse, IUser } from '@lib/types';

import log from '../utils/logger';
import { authService, deviceService } from '../services';

/** Вход пользователя */
const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { deviceId } = ctx.query;
  const { name, password } = ctx.request.body;

  if (!name) {
    ctx.throw(400, 'Не указано имя пользователя');
  }

  if (!password) {
    ctx.throw(400, 'Не указан пароль');
  }

  if (!deviceId) {
    ctx.throw(400, 'Не указан идентификатор устройства');
  }

  try {
    await authService.authenticate(ctx as Context, next);

    const user = ctx.state.user as IUser;

    const result: IResponse<IUser> = { result: true, data: user };

    ctx.status = 200;
    ctx.body = result;

    log.info(`logIn: user '${user.id}' is successfully logged in`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

/** Проверка текущего пользователя в сессии koa */
const getCurrentUser = (ctx: ParameterizedContext): void => {
  const { user } = ctx.state;

  delete user.password;

  const res: IResponse<IUser> = { result: true, data: user };

  ctx.status = 200;
  ctx.body = res;

  log.info(`getCurrentUser: user '${ctx.state.user.name}' authenticated`);
};

const logOut = (ctx: Context): void => {
  const { user } = ctx.state;

  ctx.logout();

  const res: IResponse = { result: true };

  ctx.status = 200;
  ctx.body = res;

  log.info(`logOut: user '${user.name}' successfully logged out`);
};

const signUp = async (ctx: ParameterizedContext): Promise<void> => {
  // const { deviceId } = ctx.query;
  const { externalId, name, password, firstName, lastName, phoneNumber, companies, creator } = ctx.request.body as Omit<
    IUser,
    'role' | 'id'
  > & { password: string };

  if (!name) {
    ctx.throw(400, 'Не указано имя пользователя');
  }

  if (!password) {
    ctx.throw(400, 'Не указан пароль');
  }

  const user: Omit<IUser, 'role' | 'id'> & { password: string } = {
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
    const newUser = await authService.signUp({ user });

    const result: IResponse<IUser> = { result: true, data: newUser };

    ctx.status = 200;
    ctx.body = result;

    log.info(`signUp: user '${name}' is successfully signed up`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const verifyCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { code, uid }: { code: string; uid?: string } = ctx.request.body;

  log.info(`uid: ${uid}`);
  log.info(`code: ${code}`);

  if (!code) {
    ctx.throw(400, 'не указан код');
  }

  try {
    const deviceUid = await authService.verifyCode({ code, uid });

    const result: IResponse<string> = { result: true, data: deviceUid };

    ctx.status = 200;
    ctx.body = result;

    log.info('verifyCode: ok');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

const getActivationCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceId } = ctx.params;

  if (!deviceId) {
    ctx.throw(400, 'не указан идентификатор устройства');
  }

  try {
    const code = await deviceService.genActivationCode(deviceId);
    const result: IResponse<string> = { result: true, data: code };

    ctx.status = 200;
    ctx.body = result;

    log.info('getActivationCode: ativation code generated successfully');
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

export { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode };
