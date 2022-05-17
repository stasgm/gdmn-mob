import { ICompany, IDBCompany, NewCompany as NewCompanyData, IAppSystem } from '@lib/types';

import { extraPredicate, getListPart } from '../utils/helpers';

import { ConflictException, DataNotFoundException } from '../exceptions';

import { updateOne as updateUserCompany } from './userService';

import { getDb } from './dao/db';

import { companies as mockCompanies } from './data/companies';

/**
 * Добавление новой организации
 * @param companyData - объект компании
 * @return объект компании
 * */
const addOne = (companyData: NewCompanyData): ICompany => {
  /*
    1. Проверяем что организация существует
    2. Добавляем организацию
    3. К текущему пользователю записываем созданную организацию
    4. К администратору добавляем созданную организацию
  */
  const { companies, createFoldersForCompany } = getDb();

  if (companies.data.find((el) => el.name === companyData.name)) {
    throw new ConflictException(`Компания с названием ${companyData.name} уже существует`);
  }

  // Проверяем есть ли в базе подсистемы
  const appSystemIds = companyData.appSystems ? getAppSystemIds(companyData.appSystems) : undefined;

  const company = companies.insert({
    id: '',
    name: companyData.name,
    city: companyData.city,
    appSystemIds,
    adminId: companyData.admin.id,
    externalId: companyData.externalId,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  });

  createFoldersForCompany(company);

  updateUserCompany(company.adminId, { id: company.adminId, company });

  return makeCompany(company);
};

/**
 * Обновляет одну организацию
 * @param id ИД компании
 * @param companyData Новые данные компании
 * @returns Обновленный объект компании
 */
const updateOne = (id: string, companyData: Partial<ICompany>): ICompany => {
  const { companies, users } = getDb();
  const company = companies.findById(id);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  if (companies.data.find((el) => el.name === companyData.name && el.id !== companyData.id)) {
    throw new ConflictException(`Компания с названием ${companyData.name} уже существует`);
  }

  // Проверяем есть ли в базе переданный админ
  let adminId = company.adminId;
  if (companyData.admin) {
    const admin = users.findById(companyData.admin.id);
    if (!admin) {
      throw new DataNotFoundException('Администратор не найден');
    }
    adminId = admin.id;
  }

  // Проверяем есть ли в базе подсистемы
  const appSystemIds = companyData.appSystems ? getAppSystemIds(companyData.appSystems) : undefined;

  companies.update({
    id,
    name: companyData.name || company.name,
    adminId,
    externalId: companyData.externalId || company.externalId,
    city: companyData.city,
    appSystemIds: appSystemIds || company.appSystemIds,
    creationDate: company.creationDate,
    editionDate: new Date().toISOString(),
  });

  const updatedCompany = companies.findById(id);

  if (!updatedCompany) {
    throw new DataNotFoundException('Компания не найдена');
  }

  return makeCompany(updatedCompany);
};

/**
 * Удаляет одну организацию
 * @param id ИД организации
 * */
const deleteOne = (id: string) => {
  /*
    1. Проверяем что организация существует
    2. Удаляем у пользователей организацию //TODO
    3. Удаляем организацию
  */
  const { companies, users, devices, codes, deviceBindings } = getDb();

  const company = companies.findById(id);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  //Удаляем все устройства, привязанные устройства и коды данной компании
  devices.data
    .filter((device) => device.companyId === id)
    ?.forEach((device) => {
      deviceBindings.data
        .filter((binding) => binding.deviceId === device.id)
        ?.forEach((binding) => deviceBindings.deleteById(binding.id));
      codes.data.filter((code) => code.deviceId === device.id)?.forEach((code) => codes.deleteById(code.id));
      devices.deleteById(device.id);
    });

  //Удаляем всех пользователей данной компании кроме Админа и Суперадмина
  users.data
    .filter((user) => user.company === id && user.role !== 'Admin' && user.role !== 'SuperAdmin')
    ?.forEach((user) => users.deleteById(user.id));

  //Очищаем компанию у админа
  updateUserCompany(company.adminId, { id: company.adminId, company: undefined });
  companies.deleteById(id);
};

/**
 * Возвращает одну организацию
 * @param {string} id - ИД организации
 * @return {ICompany} Объект организации
 * */
const findOne = (id: string): ICompany => {
  const company = getDb().companies.findById(id);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  return makeCompany(company);
};

/**
 * Возвращает множество компаний по указанным параметрам
 * @param {Record<string, string | number>} params - параметры
 * @return {ICompany[]}, Массив компаний
 * */
const findMany = (params: Record<string, string | number>): ICompany[] => {
  let companyList;
  if (process.env.MOCK) {
    companyList = mockCompanies;
  } else {
    companyList = getDb().companies.data;
  }

  companyList = companyList.filter((item) => {
    const newParams = (({ fromRecord, toRecord, ...others }) => others)(params);

    let companyIdFound = true;

    if ('companyId' in newParams) {
      companyIdFound = item.id === newParams.companyId;
      delete newParams['companyId'];
    }

    /** filtering data */
    let filteredCompanies = true;
    if ('filterText' in newParams) {
      const filterText: string = (newParams.filterText as string).toUpperCase();

      if (filterText) {
        const name = item.name.toUpperCase();
        const creationDate = new Date(item.creationDate || '').toLocaleString('ru', { hour12: false });
        const editionDate = new Date(item.editionDate || '').toLocaleString('ru', { hour12: false });

        filteredCompanies =
          name.includes(filterText) || creationDate.includes(filterText) || editionDate.includes(filterText);
      }
      delete newParams['filterText'];
    }

    return companyIdFound && filteredCompanies && extraPredicate(item, newParams as Record<string, string>);
  });

  return getListPart(companyList, params)?.map((company) => makeCompany(company));
};

export const makeCompany = (company: IDBCompany): ICompany => {
  const { users, appSystems } = getDb();

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: company.id,
    name: company.name,
    city: company.city,
    appSystems: company.appSystemIds?.map((s) => appSystems.getNamedItem(s)),
    admin: users.getNamedItem(company.adminId),
    externalId: company.externalId,
    creationDate: company.creationDate,
    editionDate: company.editionDate,
  };
};

const getAppSystemIds = (namedAppSystems: IAppSystem[]) => {
  // Проверяем есть ли в базе подсистемы
  return namedAppSystems.map(({ id }) => {
    if (!getDb().appSystems.findById(id)) {
      throw new DataNotFoundException('Подсистема не найдена');
    }
    return id;
  });
};

export { findOne, findMany, addOne, updateOne, deleteOne };
