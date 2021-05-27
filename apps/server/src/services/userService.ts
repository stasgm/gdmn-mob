import { IDBUser, IUser, NewUser } from '@lib/types';

import { DataNotFoundException, InnerErrorException, ConflictException } from '../exceptions';

import { hashPassword } from '../utils/crypt';
import { extraPredicate } from '../utils/helpers';

import { getNamedEntity } from './dao/utils';

import { getDb } from './dao/db';

const db = getDb();

const { users, companies } = db;

/**
 * Добавляет одного пользователя
 * @param {IUser} user - пользователь
 * @return id, идентификатор пользователя
 * */
const addOne = async (newUser: NewUser): Promise<IUser> => {
  const user = await users.find((i) => i.name.toUpperCase() === newUser.name.toUpperCase());

  if (user) {
    throw new ConflictException('пользователь с таким именем уже существует');
  }

  const passwordHash = await hashPassword(newUser.password);

  const newUserObj: IDBUser = {
    id: '',
    name: newUser.name,
    companies: newUser.companies?.map((i) => i.id),
    password: passwordHash,
    role: !newUser.creator?.id ? 'Admin' : 'User', // TODO временно!!! если создаётся пользователем то User иначе Admin
    creatorId: newUser.creator?.id || '',
    externalId: newUser.externalId,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    phoneNumber: newUser.phoneNumber,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  };

  const userId = await users.insert(newUserObj);

  if (!userId) {
    throw new InnerErrorException('Ошбка при создании пользователя');
  }

  const createdUser = await users.find(userId);

  if (!createdUser) {
    throw new InnerErrorException('Ошбка при создании пользователя');
  }

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
    throw new Error('пльзователь не найден');
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
  const user = await users.find(id);

  if (!user) {
    throw new DataNotFoundException('пользователь не найден');
  }

  // TODO Если пользователь является админом организации то прерывать
  // удаление с соответствующим сообщением
  await users.delete(id);
};

const findOne = async (id: string): Promise<IUser | undefined> => {
  const user = await users.find(id);

  if (!user) {
    throw new DataNotFoundException('пользователь не найден');
  }

  return makeUser(user);
};

const findByName = async (name: string): Promise<IUser> => {
  const user = await users.find((user) => user.name.toUpperCase() === name.toUpperCase());

  if (!user) {
    throw new DataNotFoundException('пользователь не найден');
  }

  return makeUser(user);
};

const getUserPassword = async (id: string): Promise<string> => {
  const user = await users.find(id);

  if (!user) {
    throw new DataNotFoundException('Пароль пользователя не найден');
  }

  return user.password;
};

const findAll = async (params: Record<string, string>): Promise<IUser[]> => {
  const userList = await users.read((item) => {
    const newParams = Object.assign({}, params);

    let companyFound = true;

    if ('companyId' in newParams) {
      companyFound = item.companies?.includes(newParams.companyId);
      delete newParams['companyId'];
    }

    return companyFound && extraPredicate(item, newParams);
  });

  const pr = userList.map(async (i) => await makeUser(i));

  return Promise.all(pr);
};

// /**
//  * Возвращает список устройств пользователя
//  * @param {string} id - идентификатор пользователя
//  * */
// const findDevices = async (userId: string) => {
//   const user = await users.find(userId);

//   if (!user) {
//     throw new DataNotFoundException('Пользователь не найден');
//   }

//   const deviceList = await devices.read();
//   const pr = deviceList.filter((i) => i.userId === userId).map(async (i) => await makeDevice(i));

//   return Promise.all(pr);
// };

const addCompanyToUser = async (userId: string, companyId: string) => {
  const user = await users.find(userId);

  if (!user) {
    throw new Error('пользователь не найден');
  }

  const company = await companies.find(companyId);

  if (!company) {
    throw new Error('Компания не найдена');
  }

  if (user.companies?.some((i) => companyId === i)) {
    throw new Error('Компания уже привязана к пользователю');
  }

  const companyList = [...(user.companies || []), company.id];

  return users.update({ ...user, companies: companyList });
};

const removeCompanyFromUser = async (userId: string, companyName: string) => {
  const user = await users.find(userId);

  if (!user) {
    throw new Error('пользователь не найден');
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
};
