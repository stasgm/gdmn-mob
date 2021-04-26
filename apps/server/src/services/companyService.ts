import { ICompany, IDBCompany, INamedEntity, NewCompany } from '@lib/types';

import log from '../utils/logger';

import { entities } from './dao/db';
import { addCompanyToUser } from './userService';

const { companies, users } = entities;
/**
 * Добавление новой организации
 * @param {string} title - наименование организации
 * @return id, идентификатор организации
 * */
const addOne = async (company: NewCompany): Promise<ICompany> => {
  /*
    1. Проверяем что организация существует
    2. Добавляем организацию
    3. К текущему пользователю записываем созданную организацию
    4. К администратору добавляем созданную организацию
  */

  const newCompany: IDBCompany = {
    id: '',
    name: company.name,
    adminId: company.adminId,
    externalId: company.externalId,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  };

  if (await companies.find((el) => el.name === company.name)) {
    throw new Error('Компания уже существует');
  }

  const createdCompany = await companies.find(await companies.insert(newCompany));

  // Добавляем к текущему
  await addCompanyToUser(createdCompany.adminId, createdCompany.name);

  // Добавляем к пользователю gdmn
  const user = await users.find((i) => i.name === 'gdmn');

  if (user) {
    await addCompanyToUser(user.id, createdCompany.name);
  }

  return makeCompany(createdCompany);
};

/**
 * Возвращает одну организацию
 * @param {string} id - идентификатор организации
 * @return company, организация
 * */
const findOne = async (id: string): Promise<ICompany> => {
  const company = await companies.find(id);

  if (!company) {
    throw new Error('Компания не найдена');
  }

  return makeCompany(company);
};

/**
 * Возвращает одну организацию
 * @param {string} name - наименование организации
 * @return company, организация
 * */
const findOneByName = async (name: string): Promise<ICompany> => {
  return makeCompany(await companies.find((i) => i.name === name));
};

/**
 * Возвращает множество компаний по указанным параметрам
 * @param {string} param - параметры
 * @return company[], компании
 * */

type Param = {
  [key in keyof Pick<IDBCompany, 'adminId'>]: string;
};

const findMany = async (param?: Param): Promise<ICompany[]> => {
  log.info(param);
  return (await companies.read()).map((c) => {
    return makeCompany(c);
  });
};

/**
 * Обновляет одну организацию
 * @param {IDBCompany} company - организациия
 * @return id, идентификатор организации
 * */
const updateOne = async (company: IDBCompany): Promise<string> => {
  await companies.update(company);

  return company.id;
};

/**
 * Удаляет одну организацию
 * @param {string} id - идентификатор организации
 * */
const deleteOne = async (company: IDBCompany): Promise<void> => {
  /*
    1. Проверяем что организация существует
    2. Удаляем у пользователей организацию //TODO
    3. Удаляем организацию
  */
  if (!(await companies.find(company.id))) {
    throw new Error('Компания не найдена');
  }

  await companies.delete(company.id);
};

/**
 * Возвращает пользователей организации
 * @param {string} id - идентификатор организации
 * @return users, пользователи
 * */

// TODO: Перенести  в userServiuce
/*
const findUsers = async (id: string): Promise<IUser[]> => {
  const company = await companies.find(id);

  if (!company) {
    throw new Error('Компания не найдена');
  }

  // TODO заменить на company.title на companyId
  return (await users.read())
    .filter((el) => el.companies?.some((i: string) => i === company.name))
    .map((el) => makeUser(el));
}; */

export const makeCompany = async (company: IDBCompany): Promise<ICompany> => {
  const admin = await users.find(company.adminId);

  const adminEntity: INamedEntity = admin && { id: admin.id, name: admin.name };

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: company.id,
    name: company.name,
    admin: adminEntity,
    externalId: company.externalId,
    creationDate: company.creationDate,
    editionDate: company.editionDate,
  };
};

export { findOne, findMany, addOne, updateOne, deleteOne, findOneByName };
