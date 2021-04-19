import { IDBUser, INamedEntity, IUser } from '@lib/types';

import { hashPassword } from '../utils/crypt';

import { users, devices, companies } from './dao/db';

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
 * Добавляет одного пользователя
 * @param {IUser} user - пользователь
 * @return id, идентификатор пользователя
 * */
const addOne = async (user: Omit<IUser, 'id'> & { password: string }): Promise<IUser> => {
  if (await users.find((i) => i.name.toUpperCase() === user.name.toUpperCase())) {
    throw new Error('Пользователь с таким именем уже существует');
  }

  const passwordHash = await hashPassword(user.password);

  const newUser: IDBUser = {
    id: '',
    name: user.name,
    companies: user.companies.map((i) => i.id),
    password: passwordHash,
    role: user.role,
    creatorId: user.creator?.id || '',
    externalId: user.externalId,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    createDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
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

  const newUser: IDBUser = {
    id: userId,
    name: userData.name || oldUser.name,
    companies: companyList || oldUser.companies,
    password: passwordHash,
    role: userData.role || oldUser.role,
    creatorId: userData.creator?.id || oldUser.creatorId,
    externalId: userData.externalId || oldUser.externalId,
    firstName: userData.firstName || oldUser.firstName,
    lastName: userData.lastName || oldUser.lastName,
    phoneNumber: userData.phoneNumber || oldUser.phoneNumber,
    createDate: oldUser.createDate,
    updateDate: new Date().toISOString(),
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

/**
 * Возвращает список устройств пользователя
 * @param {string} id - идентификатор пользователя
 * */
const findDevices = async (userId: string) => {
  const user = await users.find(userId);
  if (!user) {
    throw new Error('Пользователь не найден');
  }

  return (await devices.read())
    .filter((i) => i.userId === userId)
    .map((i) => {
      return {
        id: i.id,
        userId: i.userId,
        name: user.name,
        deviceId: i.uid,
        deviceName: i.name,
        state: i.state,
      };
    });
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
  /*   const companyList: INamedEntity[] = [];

    for await (const companyId of user.companies) {
      const company = await companies.find(companyId);

      company &&
        companyList.push({
          id: company.id,
          name: company.name,
        });
    }
   */
  /*   const userCreator = await users.find(user.creatorId);

  const creator: INamedEntity = userCreator && { id: userCreator.id, name: userCreator.name }; */

  const companyList = await getNamedArrayObject(user.companies, companies);

  const creator = await getNamedObject(user.creatorId, users);

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
    createDate: user.createDate,
    updateDate: user.updateDate,
  };
};

type DBEntities = typeof users | typeof devices | typeof companies;

const getNamedObject = async (id: string, dbObject: DBEntities): Promise<INamedEntity> => {
  const item = await dbObject.find(id);

  return item && { id: item.id, name: item.name };
};

const getNamedArrayObject = async (ids: string[], dbObject: DBEntities): Promise<INamedEntity[]> => {
  const items: INamedEntity[] = [];

  for await (const id of ids) {
    const item = await dbObject.find(id);

    item &&
      items.push({
        id: item.id,
        name: item.name,
      });
  }

  return items || [];
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
  getUserPassword,
};
