import { Next, Context } from 'koa';
import koaPassport from 'koa-passport';
import { v1 as uuidv1 } from 'uuid';
import { VerifyFunction } from 'passport-local';
import bcrypt from 'bcrypt';

import { IUser, NewUser, IUserCredentials } from '@lib/types';

import { DataNotFoundException, UnauthorizedException } from '../exceptions';

import * as userService from './userService';
import { getDb } from './dao/db';

const authenticate = async (ctx: Context, next: Next): Promise<IUser> => {
  const { devices, users } = getDb();

  const { deviceId } = ctx.query;
  const { name } = ctx.request.body as IUserCredentials;

  const user = await users.find((i) => i.name.toUpperCase() === name.toUpperCase());

  if (!user) {
    throw new UnauthorizedException('Неверные данные');
  }

  if (user.role === 'User') {
    // Для пользователей с рольдю User проверяем дополнительно DeviceId
    const device = await devices.find((el) => el.uid === deviceId);

    if (!device) {
      throw new UnauthorizedException('Связанное с пользователем Устройство не найдено');
    }

    if (device.state === 'BLOCKED') {
      throw new UnauthorizedException('Устройство заблокировано');
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
 * Регистрация нового пользователя (Администратора компании)
 * @param user NewUser
 * @returns IUser
 */
const signUp = async (user: Omit<NewUser, 'role'>): Promise<IUser> => {
  const { users } = getDb();

  // Кол-во пользователей
  const userCount = (await users.read()).length;
  // Роль нового пользователя
  const role = userCount === 0 ? 'SuperAdmin' : 'Admin';
  // Создаём пользователя
  const newUser = await userService.addOne({ ...user, role });

  /*   if (userCount === 0) {
      // При создании первого пользователя создаётся устройство WEB для входа через браузер (WEB-ADMIN)
      const webDeviceId = await devices.insert({
        name: 'WEB',
        uid: 'WEB',
        state: 'ACTIVE',
        creationDate: new Date().toISOString(),
        editionDate: new Date().toISOString(),
      } as IDBDevice);

      // TODO временно!!!
      // Создаём пользователя gdmn (внешняя система). В дальнейшем тоже надо создавать для каждой организации
      const gdmnUserObj: NewUser = {
        name: 'gdmn',
        password: 'gdmn',
        companies: [],
        creationDate: new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };

      const { id: gdmnUserId } = await userService.addOne(gdmnUserObj);
      // TODO временно!!! Привязываем пользователя gdmn (внешняя система) к устройству WEB
      // в дальнейшем будет создаваться свой DeviceId для учётной систмеы
      await deviceBindings.insert({
        state: 'ACTIVE',
        deviceId: webDeviceId,
        userId: gdmnUserId,
      } as IDBDeviceBinding);
    }

    const webDevice = await devices.find((e) => e.uid === 'WEB');

    if (webDevice) {
      // Привязываем нового пользователя к устройству WEB
      await deviceBindings.insert({
        state: 'ACTIVE',
        deviceId: webDevice.id,
        userId: newUser.id,
      } as IDBDeviceBinding);
    } */

  return newUser;
};

const validateAuthCreds: VerifyFunction = async (name: string, password: string, done) => {
  const user = await userService.findByName(name);

  if (!user) {
    return done(new Error('Неверные данные'));
  }

  const hashedPassword = await userService.getUserPassword(user.id);

  if (!hashedPassword) {
    throw new UnauthorizedException('Неверные данные');
    // throw new DataNotFoundException('имя пользователя или пароль')
  }

  if (await bcrypt.compare(password, hashedPassword)) {
    done(null, user);
  } else {
    done(new Error('Неверные данные')); //TODO возвращать ошибку вместо null
  }
};

const verifyCode = async (code: string) => {
  const db = getDb();
  const { devices, codes } = db;

  const rec = await codes.find((i) => i.code === code);

  if (!rec) {
    throw new DataNotFoundException('Код не найден');
  }

  const date: Date = new Date(rec.date);

  date.setDate(date.getDate() + 7);

  // const dateDiff = date.getDate() - new Date().getDate();

  const diffTime = Math.abs(date.getTime() - new Date().getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // await codes.delete(i => i.code === code);
    throw new UnauthorizedException('Срок действия кода истёк');
  }

  // обновляем uid у устройства
  const deviceId = uuidv1();
  const device = await devices.find(rec.deviceId);

  if (!device) {
    throw new UnauthorizedException('Код не соответствует заданному устройству');
  }

  await devices.update({ ...device, uid: deviceId, state: 'ACTIVE' });

  // const newDeviceId = await devices.insert({ userId: rec.user, uid: deviceId, blocked: false });

  await codes.delete((i) => i.code === code);

  return deviceId;
};

const logout = async (userId: string) => {
  console.log('logout', userId);
  // делаем что надо
};

export { authenticate, validateAuthCreds, signUp, verifyCode, logout };
