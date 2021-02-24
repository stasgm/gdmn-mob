import { users, devices } from './dao/db';
import { makeProfile } from '../controllers/user';
import { IUser } from '../../../common';

import { hashPassword } from '../utils/crypt';

const findOne = async (userId: string) => users.find(userId);

const findByName = async (userName: string) =>
  users.find(user => user.userName.toUpperCase() === userName.toUpperCase());

const findAll = async () => (await users.read()).map(el => makeProfile(el));

/**
 * Добавляет одного пользователя
 * @param {IUser} user - пользователь
 * @return id, идентификатор пользователя
 * */
const addOne = async (user: IUser) => {
  if (await users.find(i => i.userName.toUpperCase() === user.userName.toUpperCase())) {
    throw new Error('пользователь с таким именем уже существует');
  }

  const passwordHash = await hashPassword(user.password);

  return await users.insert({
    ...user,
    password: passwordHash,
  });
};

/**
 * Обновляет одного пользователя
 * @param {IUser} user - пользователь
 * @return id, идентификатор пользователя
 * */
const updateOne = async (user: IUser) => {
  await users.update(user);

  return user.id;
};

/**
 * Удаляет одного пользователя
 * @param {string} id - идентификатор пользователя
 * */
const deleteOne = async (id: string): Promise<void> => {
  if (!(await users.find(id))) {
    throw new Error('пользователь не найден');
  }

  // TODO Если пользователь является админом организации то прерывать
  // удаление с соответствующим сообщением
  await users.delete(id);
};

/**
 * Возвращает список устройств пользователя
 * @param {string} id - идентификатор пользователя
 * */
const findDevices = async (userId: string) => {
  const user = await users.find(userId);
  if (!user) {
    throw new Error('пользователь не найден');
  }

  return (await devices.read())
    .filter(i => i.userId === userId)
    .map(i => {
      return {
        id: i.id,
        userId: i.userId,
        userName: user.userName,
        deviceId: i.uid,
        deviceName: i.name,
        state: i.state,
      };
    });
};

const addCompanyToUser = async (userId: string, companyName: string) => {
  const user = await findOne(userId);

  if (user.companies?.some(i => companyName === i)) {
    throw new Error('организация уже привязана к пользователю');
  }

  const companies = [...(user.companies || []), companyName];

  return users.update({ ...user, companies });
};

const removeCompanyFromUser = async (userId: string, companyName: string) => {
  const user = await findOne(userId);
  if (user.companies?.some(i => companyName === i)) {
    throw new Error('организация не привязана к пользователю');
  }

  return users.update({ ...user, companies: user.companies?.filter(i => i === companyName) });
};

export {
  findOne,
  findAll,
  findByName,
  findDevices,
  addOne,
  updateOne,
  deleteOne,
  addCompanyToUser,
  removeCompanyFromUser,
};
