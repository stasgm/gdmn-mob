import { IDBUser, IUser, NewUser, IUserWithDevice, IFileNoticeInfo } from '@lib/types';

import { IErrorNotice } from '@lib/store';

import { DataNotFoundException, ConflictException, InvalidParameterException, ForbiddenException } from '../exceptions';

import { hashPassword } from '../utils/crypt';
import { extraPredicate, getListPart } from '../utils/helpers';
import { processValidation } from '../validations';

import { getDb } from './dao/db';
import { insertNotice } from './errorNotice';

import { users as mockUsers } from './data/user';

/**
 * Добавляет одного пользователя
 * @param {NewUser} userData - данные пользователя
 * @return {IUser} объект пользователя
 * */
const addOne = (userData: NewUser): IUser => {
  const { users } = getDb();

  let creatorId;
  let company: string | null = null;

  if (userData.creator) {
    const creator = users.findById(userData.creator.id);

    if (!creator?.company) {
      // Нельзя создавать пользователей пока не создана администратором организация
      throw new InvalidParameterException('Не создана организация');
    }

    creatorId = creator.id;
    company = creator.company;
  }

  if (users.data.find((i) => i.name.toUpperCase() === userData.name.toUpperCase())) {
    throw new ConflictException('Пользователь с таким именем уже существует');
  }

  const passwordHash = hashPassword(userData.password);

  const user = users.insert({
    id: '',
    alias: userData.alias,
    name: userData.name,
    company,
    password: passwordHash,
    role: userData.role,
    creatorId: creatorId || '',
    externalId: userData.externalId,
    firstName: userData.firstName,
    lastName: userData.lastName,
    middleName: userData.middleName,
    phoneNumber: userData.phoneNumber,
    email: userData.email,
    erpUserId: userData.erpUser?.id,
    appSystemId: userData.appSystem?.id,
    disabled: userData.disabled,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  });

  return makeUser(user);
};

/**
 * Обновляет одного пользователя
 * @param id - ИД пользователя
 * @param userData - данные пользователя
 * @return обновленный объект пользователя
 * */
const updateOne = (id: string, userData: Partial<IUser & { password: string }>): IUser => {
  const { users, companies, appSystems } = getDb();

  const oldUser = users.findById(id);

  if (!oldUser) {
    throw new DataNotFoundException('Пользователь не найден');
  }
  // Если передан новый пароль то хешируем и заменяем
  const passwordHash = userData.password ? hashPassword(userData.password) : oldUser.password;

  // Проверяем есть ли в базе переданная компания
  let company = oldUser.company;
  if (userData.company) {
    const companyObj = companies.findById(userData.company.id);
    if (!companyObj) {
      throw new DataNotFoundException('Компания не найдена');
    }
    company = companyObj.id;
  }

  // Проверяем есть ли в базе переданный creator
  let creatorId = oldUser.creatorId;
  if (userData.creator) {
    const creator = users.findById(userData.creator.id);
    if (!creator) {
      throw new DataNotFoundException('Создатель пользователя не найден');
    }
    creatorId = creator.id;
  }

  // Проверяем есть ли в базе переданная подсистема
  let newAppSystemId;
  if (userData.appSystem) {
    newAppSystemId = appSystems.findById(userData.appSystem.id)?.id;
    if (!newAppSystemId) {
      throw new DataNotFoundException('Подсистема не найдена');
    }
    if (
      users.data.find((u) => u.appSystemId === userData.appSystem!.id && u.company === company && u.id !== userData.id)
    ) {
      throw new DataNotFoundException('Пользователь для данной подсистемы уже существует');
    }
  }
  // Проверяем есть ли в базе пользователь ERP
  let newErpUserId;
  if (userData.erpUser) {
    newErpUserId = users.findById(userData.erpUser.id)?.id;
    if (!newErpUserId) {
      throw new DataNotFoundException('Пользователь ERP не найден');
    }
  }

  users.update({
    id,
    alias: userData.alias === undefined ? oldUser.alias : userData.alias,
    name: userData.name || oldUser.name,
    company,
    password: passwordHash,
    role: oldUser.role,
    creatorId,
    externalId: userData.externalId === undefined ? oldUser.externalId : userData.externalId,
    firstName: userData.firstName === undefined ? oldUser.firstName : userData.firstName,
    lastName: userData.lastName === undefined ? oldUser.lastName : userData.lastName,
    middleName: userData.middleName === undefined ? oldUser.middleName : userData.middleName,
    phoneNumber: userData.phoneNumber === undefined ? oldUser.phoneNumber : userData.phoneNumber,
    email: userData.email === undefined ? oldUser.email : userData.email,
    erpUserId: userData.erpUser === null ? undefined : newErpUserId || oldUser.erpUserId,
    appSystemId: userData.appSystem === null ? undefined : newAppSystemId || oldUser.appSystemId,
    disabled: userData.disabled === undefined ? oldUser.disabled : userData.disabled,
    creationDate: oldUser.creationDate,
    editionDate: new Date().toISOString(),
  });

  const updatedUser = users.findById(id);

  if (!updatedUser) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  return makeUser(updatedUser);
};

/**
 * Удаляет одного пользователя
 * @param {string} id - идентификатор пользователя
 * */
const deleteOne = (id: string) => {
  const { users, deviceBindings } = getDb();

  const user = users.findById(id);

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  // TODO Если пользователь является админом организации то прерывать
  // удаление с соответствующим сообщением
  if (user.role === 'SuperAdmin' || (user.role === 'Admin' && Boolean(user.company))) {
    throw new ForbiddenException('Администратор не может быть удален');
  }

  deviceBindings.data.filter((b) => b.userId === id)?.forEach((b) => deviceBindings.deleteById(b.id));
  users.deleteById(id);
};

/**
 * Возвращает одного пользователя
 * @param id ИД пользователя
 * @returns
 */
const findOne = (id: string): IUser => {
  let user;
  if (process.env.MOCK) {
    user = mockUsers.find((i) => i.id === id) as IDBUser;
  } else {
    user = getDb().users.findById(id);
  }

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  return makeUser(user);
};

/**
 * Находит пользователя по логину
 * @param name - логин пользователя
 * @returns
 */
const findByName = (name: string): IUser => {
  let user;
  if (process.env.MOCK) {
    user = mockUsers.find((user) => user.name.toUpperCase() === name.toUpperCase());
  } else {
    user = getDb().users.data.find((user) => user.name.toUpperCase() === name.toUpperCase());
  }

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  return makeUser(user);
};

/**
 * Возвращает хэшированный пароль пользователя
 * @param id
 * @returns
 */
const getUserPassword = (id: string): string => {
  let user;
  if (process.env.MOCK) {
    user = mockUsers.find((i) => i.id === id) as IDBUser;
  } else {
    user = getDb().users.findById(id);
  }

  if (!user) {
    throw new DataNotFoundException('Пользователь не найден');
  }

  return user.password;
};

/**
 *  Возвращает множество пользователей по указанным параметрам
 * @param params - параметры
 * @returns
 */
const findMany = (params: Record<string, string | number>): IUser[] => {
  let userList;
  if (process.env.MOCK) {
    userList = mockUsers;
  } else {
    userList = getDb().users.data;
  }

  userList = userList.filter((item) => {
    const newParams = (({ fromRecord, toRecord, ...others }) => others)(params);

    let companyFound = true;

    if ('companyId' in newParams) {
      companyFound = item.company === newParams.companyId;
      delete newParams['companyId'];
    }

    let appSystemFound = true;

    if ('appSystemId' in newParams) {
      appSystemFound = item.appSystemId === newParams.appSystemId;
      delete newParams['appSystemId'];
    }

    let erpUserFound = true;

    if ('erpUserId' in newParams) {
      erpUserFound = item.erpUserId === newParams.erpUserId;
      delete newParams['erpUserId'];
    }

    /** filtering data */
    let filteredUsers = true;
    if ('filterText' in newParams) {
      const filterText: string = (newParams.filterText as string).toUpperCase();

      if (filterText) {
        const name = item.name.toUpperCase();
        const firstname = typeof item.firstName === 'string' ? item.firstName.toUpperCase() : '';
        const lastName = typeof item.lastName === 'string' ? item.lastName.toUpperCase() : '';
        const middleName = typeof item.middleName === 'string' ? item.middleName.toUpperCase() : '';
        const creationDate = new Date(item.creationDate || '').toLocaleString('ru', { hour12: false });
        const editionDate = new Date(item.editionDate || '').toLocaleString('ru', { hour12: false });

        filteredUsers =
          name.includes(filterText) ||
          firstname.includes(filterText) ||
          lastName.includes(filterText) ||
          middleName.includes(filterText) ||
          creationDate.includes(filterText) ||
          editionDate.includes(filterText);
      }
      delete newParams['filterText'];
    }

    return (
      companyFound &&
      filteredUsers &&
      erpUserFound &&
      appSystemFound &&
      extraPredicate(item, newParams as Record<string, string>)
    );
  });

  return getListPart(userList, params).map((i) => makeUser(i));
};

/**
 *  Возвращает множество пользователей c uid device по указанным параметрам
 * @param params - параметры
 * @returns
 */
export const findManyWithDevice = (params: Record<string, string | number>): IUserWithDevice[] => {
  const userList = findMany(params);
  const { devices, deviceBindings } = getDb();
  return userList.map((user) => {
    const deviceUids = deviceBindings.data.reduce<(string | undefined)[]>((prev, item) => {
      return item.userId === user.id && item.state === 'ACTIVE' && !!devices.findById(item.deviceId)?.uid
        ? [...prev, devices.findById(item.deviceId)?.uid]
        : prev;
    }, []) as string[];
    return { ...user, ...(deviceUids.length && { deviceUids: deviceUids }) };
  });
};

/**
 *  Возвращает пользователя c uid device по указанным параметрам
 * @id id пользователя
 * @returns
 */
export const findOneWithDevice = (id: string): IUserWithDevice => {
  const user = findOne(id);
  const { devices, deviceBindings } = getDb();
  const deviceUids = deviceBindings.data.reduce<(string | undefined)[]>((prev, item) => {
    return item.userId === user.id && item.state === 'ACTIVE' && !!devices.findById(item.deviceId)?.uid
      ? [...prev, devices.findById(item.deviceId)?.uid]
      : prev;
  }, []) as string[];
  return { ...user, ...(deviceUids.length && { deviceUids: deviceUids }) };
};

export const makeUser = (user: IDBUser): IUser => {
  const { companies, users, appSystems } = getDb();

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: user.id,
    alias: user.alias,
    name: user.name,
    company: user.company ? companies.getNamedItem(user.company) : void 0,
    role: user.role,
    creator: users.getNamedItem(user.creatorId),
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
    phoneNumber: user.phoneNumber,
    externalId: user.externalId,
    creationDate: user.creationDate,
    editionDate: user.editionDate,
    email: user.email,
    appSystem: user.appSystemId ? appSystems.getNamedItem(user.appSystemId) : undefined,
    erpUser: user.erpUserId ? users.getNamedItem(user.erpUserId) : undefined,
    disabled: user.disabled,
  };
};

/**
 * Добавляет одно сообщение
 * @param {NewErrorNotice} NewErrorNotice - сообщение с ошибкой
 * @param {string} producerId - идентификатор отправителя
 * @param {string} appSystemId - идентификатор системы
 * @param {string} companyId - идентификатор организация
 * @param {string} deviceId- идентификатор устройства
 * @return void
 * */
/**
 * Добавляет запись с ошибкой в файл
 * по пользователю и устройству
 */
export const addOneNotice = async ({
  NewErrorNotice,
  producerId,
  appSystemId,
  companyId,
  deviceId,
}: {
  NewErrorNotice: IErrorNotice;
  producerId: string;
  appSystemId: string;
  companyId: string;
  deviceId: string;
}): Promise<void> => {
  const { companies, appSystems, users, devices } = getDb();
  if (!companies.findById(companyId)) {
    throw new DataNotFoundException('Компания не найдена');
  }

  if (!users.findById(producerId)) {
    throw new DataNotFoundException('Отправитель не найден');
  }

  const appSystem = appSystems.findById(appSystemId);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  if (!devices.data.find((el: any) => el.uid === deviceId)) {
    throw new DataNotFoundException('Устройство не найдено');
  }

  const fileInfo: IFileNoticeInfo = {
    producerId,
    deviceId,
  };

  return await insertNotice(NewErrorNotice, { companyId, appSystemId: appSystem.id }, fileInfo);
};

export { findOne, findMany, findByName, addOne, updateOne, deleteOne, getUserPassword };
