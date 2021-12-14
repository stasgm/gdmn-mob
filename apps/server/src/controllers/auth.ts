import { ParameterizedContext, Next, Context } from 'koa';

import { IUser, IUserCredentials, NewActivationCode } from '@lib/types';

import log from '../utils/logger';
import { authService } from '../services';
import { created, ok } from '../utils/apiHelpers';

/**
 * Регистрация нового пользователя (Администратора компании)
 * */
const signup = async (ctx: ParameterizedContext): Promise<void> => {
  const { name, password, email } = ctx.request.body as IUserCredentials;
  await authService.signup({
    password,
    name,
    email,
  });

  created(ctx as Context);

  log.info(`signup: user '${name}' is successfully signed up`);
};

/**
 * Вход пользователя
 * */
const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  await authService.authenticate(ctx as Context, next);

  const user = ctx.state.user as IUser;

  ok(ctx as Context, user);

  log.info(`logIn: user '${user.id}' is successfully logged in`);
};

/**
 * Проверка текущего пользователя в сессии koa
 * */
const getCurrentUser = (ctx: ParameterizedContext): void => {
  const { user } = ctx.state;

  delete user.password;

  ok(ctx as Context, user);

  log.info(`getCurrentUser: user '${ctx.state.user.name}' authenticated`);
};

const logout = async (ctx: Context): Promise<void> => {
  const user = ctx.state.user as IUser;

  await authService.logout(user.id);

  ctx.logout();
  ctx.session = null;

  ok(ctx as Context);

  log.info(`logout: user '${user.name}' successfully logged out`);
};

const verifyCode = async (ctx: ParameterizedContext): Promise<void> => {
  const { code } = ctx.request.body as NewActivationCode;

  const uid = await authService.verifyCode(code);

  ok(ctx as Context, uid);

  log.info('verifyCode: ok');
};

const getDeviceStatus = async (ctx: ParameterizedContext): Promise<void> => {
  const { id: uid } = ctx.params;

  const deviceStatus = await authService.getDeviceStatus(uid);

  ok(ctx as Context, deviceStatus);

  log.info('getDeviceStatus: ok');
};

export { signup, logIn, logout, getCurrentUser, verifyCode, getDeviceStatus };
