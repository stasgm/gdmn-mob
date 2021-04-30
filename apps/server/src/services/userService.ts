import { IDBUser, IUser, NewUser } from '@lib/types';

import { hashPassword } from '../utils/crypt';

import { entities } from './dao/db';
import { getNamedEntity } from './dao/utils';
import { makeDevice } from './deviceService';

const { users, companies, devices } = entities;

/**
 * Добавляет одного пользователя
 * @param {IUser} user - пользователь
 * @return id, идентификатор пользователя
 * */
const addOne = async (user: NewUser): Promise<IUser> => {
  if (await users.find((i) => i.name.toUpperCase() === user.name.toUpperCase())) {
    throw new Error('Пользователь с таким именем уже существует');
  }

  const passwordHash = await hashPassword(user.password);

  const newUser: IDBUser = {
    id: '',
    name: user.name,
    companies: user.companies.map((i) => i.id),
    password: passwordHash,
    role: !user.creator?.id ? 'Admin' : 'User', // TODO временно!!! если создаётся пользователем то User иначе Admin
    creatorId: user.creator?.id || '',
    externalId: user.externalId,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  };

  const createdUser = await users.find(await users.insert(newUser));

  return makeUser(createdUser);
};

/**
 * Обновляет одного пользователя
 * @param {IUser} user - пользователь
 * @return id, идентификатор пользователя
 * */
const updateOne = async (userId: string, userData: Partial<IUser & { password: string }>): Promise<IUser> => {
  const oldUser = await users.find(userId);

  if (!oldUser) {
    throw new Error('Пользователь не найден');
  }
  // Если передан новый пароль то хешируем и заменяем
  const passwordHash = userData.password ? await hashPassword(userData.password) : oldUser.password;

  // Проверяем есть ли в базе переданные организации
  const companyList: string[] = [];

  if (userData?.companies) {
    for await (const companyData of userData.companies) {
      const company = await companies.find(companyData?.id);

      company && companyList.push(company.id);
    }
  }

  // Проверяем есть ли в базе переданный creator
  const creatorId = userData?.creator ? (await users.find(userData.creator.id))?.id : oldUser.creatorId;

  const newUser: IDBUser = {
    id: userId,
    name: userData.name || oldUser.name,
    companies: companyList || oldUser.companies,
    password: passwordHash,
    role: userData.role || oldUser.role,
    creatorId,
    externalId: userData.externalId || oldUser.externalId,
    firstName: userData.firstName || oldUser.firstName,
    lastName: userData.lastName || oldUser.lastName,
    phoneNumber: userData.phoneNumber || oldUser.phoneNumber,
    creationDate: oldUser.creationDate,
    editionDate: new Date().toISOString(),
  };

  await users.update(newUser);

  const updatedUser = await users.find(userId);

  return makeUser(updatedUser);
};

/**
 * Удаляет одного пользователя
 * @param {string} id - идентификатор пользователя
 * */
const deleteOne = async (id: string): Promise<void> => {
  if (!(await users.find(id))) {
    throw new Error('Пользователь не найден');
  }

  // TODO Если пользователь является админом организации то прерывать
  // удаление с соответствующим сообщением
  await users.delete(id);
};

const findOne = async (userId: string): Promise<IUser> => {
  return makeUser(await users.find(userId));
};

const findByName = async (name: string): Promise<IUser> => {
  return makeUser(await users.find((user) => user.name.toUpperCase() === name.toUpperCase()));
};

const getUserPassword = async (userId: string): Promise<string> => {
  return (await users.find(userId)).password;
};

const findAll = async (): Promise<IUser[]> => {
  const userList = await users.read();
  const pr = userList.map(async (i) => await makeUser(i));

  return Promise.all(pr);
};

/**
 * Возвращает список устройств пользователя
 * @param {string} id - идентификатор пользователя
 * */
const findDevices = async (userId: string) => {
  const user = await users.find(userId);
  if (!user) {
    throw new Error('Пользователь не найден');
  }

  const deviceList = await devices.read();
  const pr = deviceList.filter((i) => i.userId === userId).map(async (i) => await makeDevice(i));

  return Promise.all(pr);
};

const addCompanyToUser = async (userId: string, companyName: string) => {
  const user = await users.find(userId);

  if (!user) {
    throw new Error('Пользователь не найден');
  }

  if (user.companies?.some((i) => companyName === i)) {
    throw new Error('Компания уже привязана к пользователю');
  }

  const companies = [...(user.companies || []), companyName];

  return users.update({ ...user, companies });
};

const removeCompanyFromUser = async (userId: string, companyName: string) => {
  const user = await users.find(userId);

  if (!user) {
    throw new Error('Пользователь не найден');
  }

  if (user.companies?.some((i) => companyName === i)) {
    throw new Error('Компания не привязана к пользователю');
  }

  return users.update({
    ...user,
    companies: user.companies?.filter((i) => i === companyName),
  });
};

export const makeUser = async (user: IDBUser): Promise<IUser> => {
  const companyList = await getNamedEntity(user.companies, companies);

  const creator = await getNamedEntity(user.creatorId, users);

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: user.id,
    name: user.name,
    companies: companyList,
    role: user.role,
    creator,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    externalId: user.externalId,
    creationDate: user.creationDate,
    editionDate: user.editionDate,
  };
};

export {
  findOne,
  findAll,
  findByName,
  addOne,
  updateOne,
  deleteOne,
  addCompanyToUser,
  removeCompanyFromUser,
  getUserPassword,
  findDevices,
};
