import { Next, Context } from 'koa';
import koaPassport from 'koa-passport';
import { VerifyFunction } from 'passport-local';
import { compare } from 'bcrypt';

import { IUser, NewUser, IUserCredentials, DeviceState, IDBUser } from '@lib/types';

import { DataNotFoundException, UnauthorizedException } from '../exceptions';

import config from '../../config';

import { generateId } from '../utils/helpers';

import * as userService from './userService';
import { getDb } from './dao/db';
import { users as mockUsers } from './data/user';

/**
 * Авторизация пользователя
 * @param ctx
 * @param next
 * @returns Объект пользователя
 */
const authenticate = async (ctx: Context, next: Next) => {
  const { devices, users, deviceBindings } = getDb();

  const { name } = ctx.request.body as IUserCredentials;

  let user: IDBUser | undefined;

  if (process.env.MOCK) {
    user = mockUsers.find((i) => i.name.toUpperCase() === name.toUpperCase());
  } else {
    user = users.data.find((i) => i.name.toUpperCase() === name.toUpperCase());
  }

  if (!user) {
    throw new UnauthorizedException('Неверное имя пользователя');
  }

  if (user.role === 'User') {
    // Для пользователей с ролью User проверяем дополнительно DeviceId
    const { deviceId } = ctx.query;

    const device = devices.data.find((el) => el.uid === deviceId);

    if (!device) {
      throw new UnauthorizedException('Устройство не найдено');
    }

    if (device.state === 'BLOCKED') {
      throw new UnauthorizedException('Устройство заблокировано');
    }

    const deviceBinding = deviceBindings.data.find((el) => el.deviceId === device.id && el.userId === user!.id);
    if (!deviceBinding) {
      throw new UnauthorizedException('Связанное устройство не найдено');
    }

    if (deviceBinding.state === 'BLOCKED') {
      throw new UnauthorizedException('Связанное устройство заблокировано');
    }

    if (deviceBinding.state !== 'ACTIVE') {
      throw new UnauthorizedException('Связанное устройство не активировано');
    }
  }

  return koaPassport.authenticate('local', async (err: Error, usr: IUser) => {
    if (err) {
      throw new UnauthorizedException(err.message);
    }

    //TODO посмотреть как обработать правильно
    if (!usr) {
      throw new UnauthorizedException('Неверные данные');
    }

    await ctx.login(usr);

    return usr;
  })(ctx, next);
};

/**
 * Создает нового пользователя (Суперадмина или Администратора компании)
 * @param user Данные нового пользователя
 */
const signup = (user: Omit<NewUser, 'role' | 'company'>) => {
  // Роль нового пользователя
  const role = getDb().users.data.length === 0 ? 'SuperAdmin' : 'Admin';
  // Создаём пользователя
  userService.addOne({ ...user, role });
};

/**
 * Аутентификация пользователя
 * @param name Логин пользователя
 * @param password Пароль пользователя
 * @param done
 * @returns
 */
const validateAuthCreds: VerifyFunction = async (name: string, password: string, done) => {
  const user = userService.findByName(name);

  if (!user) {
    return done(new Error(`Не найден пользователь: ${name}`));
  }

  const hashedPassword = userService.getUserPassword(user.id);

  if (!hashedPassword) {
    throw new UnauthorizedException(`Не найден хэш пароля для пользователя: ${name}`);
  }

  if (await compare(password, hashedPassword)) {
    done(null, user);
  } else {
    done(new UnauthorizedException('Неверный пароль'));
  }
};

/**
 * Проверка кода активации устройства
 * @param code Код
 * @returns uid Уникальный номер устройства или undefined
 */
const verifyCode = (code: string): string | undefined => {
  const { devices, codes, deviceBindings } = getDb();

  const codeObj = codes.data.find((i) => i.code === code);

  if (!codeObj) {
    throw new DataNotFoundException('Код не найден.\nПожалуйста, обратитесь к администратору!');
  }

  const date: Date = new Date(codeObj.date);

  date.setDate(date.getDate() + config.ACTIVE_CODE_DAYS);

  const diffTime = Math.abs(date.getTime() - new Date().getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    throw new UnauthorizedException('Срок действия кода истёк.\nПожалуйста, обратитесь к администратору!');
  }

  const device = devices.findById(codeObj.deviceId);

  if (!device) {
    throw new DataNotFoundException('По данному коду устройство не найдено.\nПожалуйста, обратитесь к администратору!');
  }

  //Устанавливаем состояние данного устройства в 'ACTIVE' и обновляем uid у устройства
  devices.update({ ...device, uid: generateId(), state: 'ACTIVE' });

  //Устанавливаем состояние привязанных устройств данного устройства в 'ACTIVE'
  deviceBindings.data
    .filter((binding) => binding.deviceId === codeObj.deviceId)
    ?.forEach((binding) => deviceBindings.update({ ...binding, state: 'ACTIVE' }));

  //Удаляем все коды
  codes.data.filter((i) => i.code === code)?.forEach((i) => codes.deleteById(i.id));

  return devices.findById(device.id)?.uid;
};

/**
 * Выход из учетной записи
 * @param userId ИД пользователя
 */
const logout = (_userId: string) => {
  // делаем что надо
};

/**
 * Возвращает статус устройства
 * @param uid Уникальный номер устройства
 * @returns Статус устройства
 */
const getDeviceStatus = (uid: string): DeviceState => {
  const device = getDb().devices.data.find((i) => i.uid === uid);

  if (!device) {
    throw new UnauthorizedException('Устройство не найдено.\nПожалуйста, обратитесь к администратору!');
  }

  return device.state;
};

/**
 * Проверка кода доступа
 * @param adminId ИД администратора
 * @param code Код
 * @returns
 */
const checkAccessCode = (adminId: string, code: string): boolean => {
  const users = getDb().users;

  const accessCode = users.data.find((i) => i.id === adminId)?.accessCode;

  return accessCode ? code === accessCode : true;
};

export { authenticate, validateAuthCreds, signup, verifyCode, logout, getDeviceStatus, checkAccessCode };
