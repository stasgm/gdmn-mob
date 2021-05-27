import { ICompany, IDBCompany, INamedEntity, NewCompany } from '@lib/types';

import { extraPredicate } from '../utils/helpers';

import { addCompanyToUser } from './userService';

import { getDb } from './dao/db';

const db = getDb();

const { companies, users } = db;
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

  if (await companies.find((el) => el.name === company.name)) {
    throw new Error('Компания уже существует');
  }

  const newCompanyObj: IDBCompany = {
    id: '',
    name: company.name,
    adminId: company.adminId,
    externalId: company.externalId,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  };

  // try {
  const newCompany = await companies.insert(newCompanyObj);

  console.log(1, newCompany);

  const createdCompany = await companies.find(newCompany);

  console.log(2, createdCompany);
  // Добавляем к текущему
  await addCompanyToUser(createdCompany.adminId, createdCompany.id);
  //TODO переделать на updateCompany

  console.log(3);

  // Добавляем к пользователю gdmn
  const user = await users.find((i) => i.name === 'gdmn');

  console.log(4, user);

  if (user) {
    await addCompanyToUser(user.id, createdCompany.id);
    console.log(5);
  }

  return makeCompany(createdCompany);
  // } catch (err) {
  //   throw new Error('Ошибка при добавлении компании');
  // }
};

/**
 * Обновляет одну организацию
 * @param {IDBCompany} company - организациия
 * @return id, идентификатор организации
 * */
const updateOne = async (id: string, companyData: Partial<ICompany>): Promise<ICompany> => {
  try {
    const oldCompany = await companies.find(id);

    // Проверяем есть ли в базе переданный админ
    const adminId = companyData?.admin ? (await users.find(companyData.admin.id))?.id : oldCompany.adminId;

    const newCompany: IDBCompany = {
      id,
      name: companyData.name || oldCompany.name,
      adminId,
      externalId: companyData.externalId || oldCompany.externalId,
      creationDate: oldCompany.creationDate,
      editionDate: new Date().toISOString(),
    };

    await companies.update(newCompany);

    const updatedCompany = await companies.find(id);

    return makeCompany(updatedCompany);
  } catch (err) {
    throw new Error('Ошибка при обновлении компании');
  }
};

/**
 * Удаляет одну организацию
 * @param {string} id - идентификатор организации
 * */
const deleteOne = async (id: string): Promise<void> => {
  /*
    1. Проверяем что организация существует
    2. Удаляем у пользователей организацию //TODO
    3. Удаляем организацию
  */
  try {
    const companyObj = await companies.find(id);

    if (!companyObj) {
      throw new Error('Компания не найдена');
    }

    await companies.delete(id);
  } catch (err) {
    throw new Error('Ошибка при удалении компании');
  }
};

/**
 * Возвращает одну организацию
 * @param {string} id - идентификатор организации
 * @return company, организация
 * */
const findOne = async (id: string): Promise<ICompany | undefined> => {
  const company = await companies.find(id);

  if (!company) return;

  return makeCompany(company);
};

/**
 * Возвращает одну организацию
 * @param {string} name - наименование организации
 * @return company, организация
 * */
const findOneByName = async (name: string): Promise<ICompany | undefined> => {
  const company = await companies.find((i) => i.name === name);

  if (!company) return;

  return makeCompany(company);
};

/**
 * Возвращает множество компаний по указанным параметрам
 * @param {string} param - параметры
 * @return company[], компании
 * */
const findAll = async (params?: Record<string, string>): Promise<ICompany[]> => {
  const companyList = await companies?.read((item) => {
    const newParams = Object.assign({}, params);

    let adminFound = true;

    if ('adminId' in newParams) {
      adminFound = item.adminId?.includes(newParams.adminId);
      delete newParams['adminId'];
    }

    return adminFound && extraPredicate(item, newParams);
  });
  console.log('companyList', companyList);
  const pr = companyList?.map(async (i) => await makeCompany(i));

  return Promise.all(pr);
};

/**
 * Возвращает пользователей организации
 * @param {string} id - идентификатор организации
 * @return users, пользователи
 * */

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

export { findOne, findAll, addOne, updateOne, deleteOne, findOneByName };
