import { IDBUser, IUser, NewUser } from '@lib/types';

//import { DB } from '@lib/mock';

import {
  DataNotFoundException,
  InnerErrorException,
  ConflictException,
  InvalidParameterException,
} from '../exceptions';

import { hashPassword } from '../utils/crypt';
import { extraPredicate } from '../utils/helpers';

import { getNamedEntity } from './dao/utils';

import { getDb } from './dao/db';

import { users as mockUsers } from './data/user';

/**
 * Добавляет одного пользователя
 * @param newUser - пользователь
 * @return id, идентификатор пользователя
 * */
const addOne = async (newUser: NewUser): Promise<IUser> => {
  const { users } = getDb();

  const user = await users.find((i) => i.name.toUpperCase() === newUser.name.toUpperCase());

  if (user) {
    // TODO проверять по каждой организации
    throw new ConflictException('Пользователь с таким именем уже существует');
  }

  let creatorId;
  let companies;

  if (newUser.creator) {
    const creator = await users.find(newUser.creator.id);

    creatorId = creator.id;
    companies = creator.companies;

    if (!creator.companies.length) {
      // Нельзя создавать пользователей пока не создана администратором организация
      throw new InvalidParameterException('Не создана организация');
    }
  }

  const passwordHash = await hashPassword(newUser.password);

  const newUserObj: IDBUser = {
    id: '',
    name: newUser.name,
    companies: companies || [],
    password: passwordHash,
    role: newUser.role,
    creatorId: creatorId || '',
    externalId: newUser.externalId,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    phoneNumber: newUser.phoneNumber,
    email: newUser.email,
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
 * @param user - пользователь
 * @return id, идентификатор пользователя
 * */
const updateOne = async (userId: string, userData: Partial<IUser & { password: string }>): Promise<IUser> => {
  const { users, companies } = getDb();

  const oldUser = await users.find(userId);

  if (!oldUser) {
    throw new DataNotFoundException('Пользователь не найден');
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
    email: userData.email || oldUser.email,
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
  const db = getDb();
  const { users } = db;

  const user = await users.find(id);

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  // TODO Если пользователь является админом организации то прерывать
  // удаление с соответствующим сообщением
  await users.delete(id);
};

const findOne = async (id: string): Promise<IUser | undefined> => {
  const db = getDb();
  const { users } = db;

  const user = await users.find(id);

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  return makeUser(user);
};

const findByName = async (name: string): Promise<IUser> => {
  const db = getDb();
  const { users } = db;

  const user = await users.find((user) => user.name.toUpperCase() === name.toUpperCase());

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  return makeUser(user);
};

const getUserPassword = async (id: string): Promise<string> => {
  const db = getDb();
  const { users } = db;

  const user = await users.find(id);

  if (!user) {
    throw new DataNotFoundException('Пароль пользователя не найден');
  }

  return user.password;
};

const findAll = async (params: Record<string, string | number>): Promise<IUser[]> => {
  const db = getDb();
  const { users } = db;

  //console.log('findAll', DB);

  let userList;
  if (process.env.MOCK) {
    userList = mockUsers;
  } else {
    userList = await users.read();
  }

  //const userList = await users.read((item) => {
  userList = userList.filter((item) => {
    const newParams = (({ fromRecord, toRecord, ...others }) => others)(params);

    let companyFound = true;

    if ('companyId' in newParams) {
      if (newParams.companyId) {
        companyFound = item.companies?.includes(newParams.companyId as string);
      }
      delete newParams['companyId'];
    }

    /** filtering data */
    let filteredUsers = true;
    if ('filterText' in newParams) {
      const filterText: string = (newParams.filterText as string).toUpperCase();

      if (filterText) {
        const name = item.name.toUpperCase();
        const firstname = typeof item.firstName === 'string' ? item.firstName.toUpperCase() : '';
        const lastName = typeof item.lastName === 'string' ? item.lastName.toUpperCase() : '';

        filteredUsers = name.includes(filterText) || firstname.includes(filterText) || lastName.includes(filterText);
      }
      delete newParams['filterText'];
    }

    return companyFound && filteredUsers && extraPredicate(item, newParams as Record<string, string>);
  });

  /** pagination */
  const limitParams = Object.assign({}, params);

  let fromRecord = 0;
  if ('fromRecord' in limitParams) {
    fromRecord = limitParams.fromRecord as number;
  }

  let toRecord = userList.length;
  if ('toRecord' in limitParams)
    toRecord = (limitParams.toRecord as number) > 0 ? (limitParams.toRecord as number) : toRecord;

  const pr = userList.slice(fromRecord, toRecord).map(async (i) => await makeUser(i));

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
  const db = getDb();
  const { users, companies } = db;

  const user = await users.find(userId);

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  const company = await companies.find(companyId);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  if (user.companies?.some((i) => companyId === i)) {
    throw new DataNotFoundException('Компания уже привязана к пользователю');
  }

  const companyList = [...(user.companies || []), company.id];

  return await users.update({ ...user, companies: companyList });
};

const removeCompanyFromUser = async (userId: string, companyName: string) => {
  const db = getDb();
  const { users } = db;

  const user = await users.find(userId);

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  if (user.companies?.some((i) => companyName === i)) {
    throw new DataNotFoundException('Компания не привязана к пользователю');
  }

  return users.update({
    ...user,
    companies: user.companies?.filter((i) => i === companyName),
  });
};

export const makeUser = async (user: IDBUser): Promise<IUser> => {
  const db = getDb();
  const { companies, users } = db;

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
    email: user.email,
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
