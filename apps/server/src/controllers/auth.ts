import { ParameterizedContext, Next, Context } from 'koa';

import { IResponse, IUser, IUserCredentials, NewUser } from '@lib/types';

import log from '../utils/logger';
import { authService, deviceService } from '../services';
import { InvalidParameterException } from '../exceptions';

/**
 * Регистрация нового пользователя
 * */
const signUp = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, password } = ctx.request.body as IUserCredentials;

  if (!name) {
    throw new InvalidParameterException('Не указано имя пользователя');
    // ctx.throw(400, 'Не указано имя пользователя');
  }

  if (!password) {
    throw new InvalidParameterException('Не указан пароль');
    // ctx.throw(400, 'Не указан пароль');
  }

  const user: NewUser = {
    password,
    name,
    companies: [],
  };

  try {
    const newUser = await authService.signUp(user);

    const result: IResponse<IUser> = { result: true, data: newUser };

    ctx.status = 200;
    ctx.body = result;

    log.info(`signUp: user '${name}' is successfully signed up`);
  } catch (err) {
    ctx.throw(400, err.message);
  }
};

/**
 * Вход пользователя
 * */
const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { deviceId } = ctx.query;
  const { name, password } = ctx.request.body as IUserCredentials;

  if (!name) {
    throw new InvalidParameterException('Не указано имя пользователя');
    // ctx.throw(400, 'Не указано имя пользователя');
  }

  if (!password) {
    throw new InvalidParameterException('Не указан пароль');
    // ctx.throw(400, 'Не указан пароль');
  }

  if (!deviceId) {
    throw new InvalidParameterException('Не указан идентификатор устройства');
    // ctx.throw(400, 'Не указан идентификатор устройства');
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

/**
 * Проверка текущего пользователя в сессии koa
 * */
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

const verifyCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { code, uid }: { code: string; uid?: string } = ctx.request.body;

  log.info(`uid: ${uid}`);
  log.info(`code: ${code}`);

  if (!code) {
    throw new InvalidParameterException('Не указан код активации');
    // ctx.throw(400, 'не указан код');
  }

  const deviceUid = await authService.verifyCode({ code, uid });

  const result: IResponse<string> = { result: true, data: deviceUid };

  ctx.status = 200;
  ctx.body = result;

  log.info('verifyCode: ok');
};

const getActivationCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { deviceId } = ctx.params;

  if (!deviceId) {
    throw new InvalidParameterException('Не указан идентификатор устройства');
  }

  const code = await deviceService.genActivationCode(deviceId);
  const result: IResponse<string> = { result: true, data: code };

  ctx.status = 200;
  ctx.body = result;

  log.info('getActivationCode: ativation code generated successfully');
};

export { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode };
