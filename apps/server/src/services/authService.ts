import { Next, Context } from 'koa';
import koaPassport from 'koa-passport';
import { v1 as uuidv1 } from 'uuid';
import { VerifyFunction } from 'passport-local';
import bcrypt from 'bcrypt';

import { IUser, NewUser, IUserCredentials, DeviceState, IDBDeviceBinding, IDBUser } from '@lib/types';

import { DataNotFoundException, UnauthorizedException } from '../exceptions';

import * as userService from './userService';
import { getDb } from './dao/db';
import { users as mockUsers } from './data/user';

const authenticate = async (ctx: Context, next: Next): Promise<IUser> => {
  const { devices, users, deviceBindings } = getDb();

  const { name } = ctx.request.body as IUserCredentials;

  let user: IDBUser;

  if (process.env.MOCK) {
    user = mockUsers.find((i) => i.name.toUpperCase() === name.toUpperCase()) as IDBUser;
  } else {
    user = await users.find((i) => i.name.toUpperCase() === name.toUpperCase());
  }
  // const user = await users.find((i) => i.name.toUpperCase() === name.toUpperCase());

  // TODO Вынести в отдельную функцию
  if (!user) {
    throw new UnauthorizedException('Неверные данные');
  }

  if (user.role === 'User') {
    // Для пользователей с ролью User проверяем дополнительно DeviceId
    const { deviceId } = ctx.query;

    const device = await devices.find((el) => el.uid === deviceId);

    if (!device) {
      throw new UnauthorizedException('Устройство не найдено');
    }

    if (device.state === 'BLOCKED') {
      throw new UnauthorizedException('Устройство заблокировано');
    }

    const deviceBinding = await deviceBindings.find((el) => el.deviceId === device.id && el.userId === user.id);
    if (!deviceBinding) {
      throw new UnauthorizedException('Связанное с пользователем устройство не найдено');
    }

    if (deviceBinding.state === 'BLOCKED') {
      throw new UnauthorizedException('Связанное с пользователем устройство заблокировано');
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
const signup = async (user: Omit<NewUser, 'role' | 'company'>): Promise<undefined> => {
  const { users } = getDb();

  // Кол-во пользователей
  const userCount = (await users.read()).length;
  // Роль нового пользователя
  const role = userCount === 0 ? 'SuperAdmin' : 'Admin';
  // Создаём пользователя
  await userService.addOne({ ...user, role });

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

  // return newUser;
  return;
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

  if (process.env.MOCK) {
    if (password === hashedPassword) {
      done(null, user);
    } else {
      done(new Error('Неверные данные')); //TODO возвращать ошибку вместо null
    }
  } else {
    if (await bcrypt.compare(password, hashedPassword)) {
      done(null, user);
    } else {
      done(new Error('Неверные данные')); //TODO возвращать ошибку вместо null
    }
  }
};

const verifyCode = async (code: string) => {
  const db = getDb();
  const { devices, codes, deviceBindings } = db;

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
  const uid = uuidv1();
  const device = await devices.find(rec.deviceId);
  const deviceBinding = await deviceBindings.read((deviceBinding) => deviceBinding.deviceId === rec.deviceId);

  if (!device) {
    throw new DataNotFoundException('По данному коду устройство не найдено');
  }

  await devices.update({ ...device, uid: uid, state: 'ACTIVE' });

  const updateDeviceBindings = async (deviceBindingList: IDBDeviceBinding[]) => {
    for (const item of deviceBindingList) {
      // eslint-disable-next-line no-await-in-loop
      await deviceBindings.update({ ...item, state: 'ACTIVE' });
    }
  };
  // await devic  eBindings.update({ ...deviceBinding, state: 'ACTIVE' });

  updateDeviceBindings(deviceBinding);
  await codes.delete((i) => i.code === code);

  const updatedDevice = await devices.find(device.id);

  return updatedDevice.uid;
};

const logout = async (userId: string) => {
  console.log('logout', userId);
  // делаем что надо
};

// Получить статус устройства

const getDeviceStatus = async (uid: string): Promise<DeviceState> => {
  const { devices } = getDb();
  const device = await devices.find((i) => i.uid === uid);

  if (!device) {
    throw new UnauthorizedException('Устройство не найдено');
  }

  return device.state;
};

export { authenticate, validateAuthCreds, signup, verifyCode, logout, getDeviceStatus };
