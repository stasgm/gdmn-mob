import { ParameterizedContext, Next, Context } from 'koa';

import { IUser, IUserCredentials, NewActivationCode } from '@lib/types';

import log from '../utils/logger';
import { authService } from '../services';
import { created, ok } from '../utils/apiHelpers';
import { DataNotFoundException } from '../exceptions';

/**
 * Регистрация нового пользователя (Администратора компании)
 * */
export const signup = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { name, password, email } = ctx.request.body as IUserCredentials;
  console.log('1111');
  await authService.signup({
    password,
    name,
    email,
  });

  created(ctx as Context, undefined, `signup: user '${name}' is successfully signed up`);
};

/**
 * Вход пользователя
 * */
export const logIn = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  await authService.authenticate(ctx as Context, next);
  // console.log('1111');
  const user = ctx.state.user as IUser;
  // const user = { id: 1, name: 'name' };
  console.log('user', user);

  ok(ctx as Context, user, `logIn: user '${user.id}' is successfully logged in`);
};

/**
 * Проверка текущего пользователя в сессии koa
 * */
export const getCurrentUser = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { user } = ctx.state;

  delete user.password;

  ok(ctx as Context, user, `getCurrentUser: user '${user.name}' authenticated`);
};

export const logout = async (ctx: Context, next: Next): Promise<void> => {
  const user = ctx.state.user as IUser;

  authService.logout(user.id);

  ctx.logout();
  ctx.session = null;

  ok(ctx as Context, undefined, `logout: user '${user.name}' successfully logged out`);
};

export const verifyCode = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { code } = ctx.request.body as NewActivationCode;

  const uid = authService.verifyCode(code);

  ok(ctx as Context, uid, 'verifyCode: ok');
};

export const getDeviceStatus = async (ctx: ParameterizedContext, next: Next): Promise<void> => {
  const { id: uid } = ctx.params;

  const deviceStatus = authService.getDeviceStatus(uid);

  ok(ctx as Context, deviceStatus, 'getDeviceStatus: ok');
};
