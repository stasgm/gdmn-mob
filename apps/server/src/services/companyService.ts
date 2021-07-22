import { ICompany, IDBCompany, INamedEntity, NewCompany } from '@lib/types';

import { extraPredicate } from '../utils/helpers';

import { ConflictException, DataNotFoundException } from '../exceptions';

import { updateOne as updateUserCompany } from './userService';

import { getDb } from './dao/db';

import { companies as mockCompanies } from './data/companies';

// const db = getDb();
// const { companies, users } = db;
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
  const { companies, users } = getDb();

  if (await companies.find((el) => el.name === company.name)) {
    throw new ConflictException('Компания уже существует');
  }

  const newCompanyObj = {
    name: company.name,
    city: company.city,
    adminId: company.admin.id,
    externalId: company.externalId,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  } as IDBCompany;

  console.log('newCompanyObj', newCompanyObj);
  const newCompany = await companies.insert(newCompanyObj);

  const createdCompany = await companies.find(newCompany);

  // Добавляем к текущему
  //await addCompanyToUser(createdCompany.adminId, createdCompany.id);
  await updateUserCompany(createdCompany.adminId, { id: createdCompany.adminId, company: createdCompany });
  //TODO переделать на updateCompany

  // TODO Временно! Добавляем к пользователю gdmn
  const user = await users.find((i) => i.name === 'gdmn');

  if (user) {
    //await addCompanyToUser(user.id, createdCompany.id);
    await updateUserCompany(user.id, { id: user.id, company: createdCompany });
  }

  const retCompany = await makeCompany(createdCompany);

  return retCompany;
};

/**
 * Обновляет одну организацию
 * @param {IDBCompany} company - организациия
 * @return id, идентификатор организации
 * */
const updateOne = async (id: string, companyData: Partial<ICompany>): Promise<ICompany> => {
  const db = getDb();
  const { companies, users } = db;

  const companyObj = await companies.find(id);

  if (!companyObj) {
    throw new DataNotFoundException('Компания не найдена');
  }

  // Проверяем есть ли в базе переданный админ
  let adminId = companyObj.adminId;
  if (companyData?.admin) {
    adminId = (await users.find(companyData.admin.id))?.id;
  }

  const newCompany: IDBCompany = {
    id,
    name: companyData.name || companyObj.name,
    adminId,
    externalId: companyData.externalId || companyObj.externalId,
    creationDate: companyObj.creationDate,
    editionDate: new Date().toISOString(),
  };

  await companies.update(newCompany);

  const updatedCompany = await companies.find(id);

  return await makeCompany(updatedCompany);
};

/**
 * Удаляет одну организацию
 * @param {string} id - идентификатор организации
 * */
const deleteOne = async (id: string): Promise<string> => {
  /*
    1. Проверяем что организация существует
    2. Удаляем у пользователей организацию //TODO
    3. Удаляем организацию
  */
  const db = getDb();
  const { companies } = db;

  const companyObj = await companies.find(id);

  if (!companyObj) {
    throw new DataNotFoundException('Компания не найдена');
  }

  await companies.delete(id);
  return 'Компания удалена';
};

/**
 * Возвращает одну организацию
 * @param {string} id - идентификатор организации
 * @return company, организация
 * */
const findOne = async (id: string): Promise<ICompany> => {
  const db = getDb();
  const { companies } = db;

  const company = await companies.find(id);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  return await makeCompany(company);
};

// /**
//  * Возвращает одну организацию
//  * @param {string} name - наименование организации
//  * @return company, организация
//  * */
// const findOneByName = async (name: string): Promise<ICompany> => {
//   const db = getDb();
//   const { companies } = db;

//   const company = await companies.find((i) => i.name === name);

//   if (!company) {
//     throw new DataNotFoundException('Компания не найдена');
//   }

//   return await makeCompany(company);
// };

/**
 * Возвращает множество компаний по указанным параметрам
 * @param {string} param - параметры
 * @return company[], компании
 * */
const findAll = async (params: Record<string, string | number>): Promise<ICompany[]> => {
  const { companies } = getDb();

  let companyList;
  if (process.env.MOCK) {
    companyList = mockCompanies;
  } else {
    companyList = await companies.read();
  }

  //const companyList = await companies?.read((item) => {
  companyList = companyList.filter((item) => {
    const newParams = (({ fromRecord, toRecord, ...others }) => others)(params);
    //const newParams = Object.assign({}, params);

    let companyIdFound = true;

    if ('companyId' in newParams) {
      companyIdFound = item.id === newParams.companyId;
      delete newParams['companyId'];
    }

    /*
    let adminFound = true;

    if ('adminId' in newParams) {
       adminFound = item.adminId?.includes(newParams.adminId);
       delete newParams['adminId'];
    }
    */

    /*name обработается в extraPredicate */
    // let nameFound = true;

    // if ('name' in newParams) {
    //   nameFound = item.name === newParams.name;
    //   delete newParams['name'];
    // }

    /** filtering data */
    let filteredCompanies = true;
    if ('filterText' in newParams) {
      const filterText: string = (newParams.filterText as string).toUpperCase();

      if (filterText) {
        const name = item.name.toUpperCase();
        //const firstname = typeof item.firstName === 'string' ? item.firstName.toUpperCase() : '';
        //const lastName = typeof item.lastName === 'string' ? item.lastName.toUpperCase() : '';

        filteredCompanies = name.includes(filterText);
        // || firstname.includes(filterText) || lastName.includes(filterText);
      }
      delete newParams['filterText'];
    }

    return companyIdFound && filteredCompanies && extraPredicate(item, newParams as Record<string, string>);
  });

  const pr = companyList?.map(async (i) => await makeCompany(i));

  return await Promise.all(pr);
};

/**
 * Возвращает пользователей организации
 * @param {string} id - идентификатор организации
 * @return users, пользователи
 * */

export const makeCompany = async (company: IDBCompany): Promise<ICompany> => {
  const db = getDb();
  const { users } = db;

  const admin = await users.find(company.adminId);

  const adminEntity: INamedEntity = admin && { id: admin.id, name: admin.name };

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: company.id,
    name: company.name,
    city: company.city,
    admin: adminEntity,
    externalId: company.externalId,
    creationDate: company.creationDate,
    editionDate: company.editionDate,
  };
};

export { findOne, findAll, addOne, updateOne, deleteOne };
