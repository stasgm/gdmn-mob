import { ICompany, IDBCompany, NewCompany as NewCompanyData, IAppSystem } from '@lib/types';

import { extraPredicate } from '../utils/helpers';

import { ConflictException, DataNotFoundException } from '../exceptions';

import { updateOne as updateUserCompany } from './userService';

import { getDb } from './dao/db';

import { companies as mockCompanies } from './data/companies';
import { getNamedEntitySync } from './dao/utils';

/**
 * Добавление новой организации
 * @param {string} title - наименование организации
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

  if (companies.data.findById((el) => el.name === companyData.name)) {
    throw new ConflictException(`Компания с названием ${companyData.name} уже существует`);
  }

  // Проверяем есть ли в базе подсистемы
  const appSystemIds = companyData.appSystems ? getAppSystemIds(companyData.appSystems) : undefined;

  const company = companies.insert({
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
 * @param {IDBCompany} company - организациия
 * @return id, идентификатор организации
 * */
const updateOne = (id: string, companyData: Partial<ICompany>): ICompany => {
  const { companies, users } = getDb();

  const companyObj = companies.findById(id);

  if (!companyObj) {
    throw new DataNotFoundException('Компания не найдена');
  }

  // Проверяем есть ли в базе переданный админ
  let adminId = companyObj.adminId;
  if (companyData.admin) {
    const admin = users.findById(companyData.admin.id);
    if (!admin) {
      throw new DataNotFoundException(`Администратор ${companyData.admin.id} не найден`);
    }
    adminId = admin.id;
  }

  // Проверяем есть ли в базе подсистемы
  const appSystemIds = companyData.appSystems ? getAppSystemIds(companyData.appSystems) : undefined;

  const newCompany: IDBCompany = {
    id,
    name: companyData.name || companyObj.name,
    adminId,
    externalId: companyData.externalId || companyObj.externalId,
    city: companyData.city,
    appSystemIds: appSystemIds || companyObj.appSystemIds,
    creationDate: companyObj.creationDate,
    editionDate: new Date().toISOString(),
  };

  companies.update(newCompany);

  const updatedCompany = companies.findById(id);

  return makeCompany(updatedCompany);
};

/**
 * Удаляет одну организацию
 * @param {string} id - идентификатор организации
 * */
const deleteOne = (id: string): string => {
  /*
    1. Проверяем что организация существует
    2. Удаляем у пользователей организацию //TODO
    3. Удаляем организацию
  */

  const { companies, users, devices, codes, deviceBindings } = getDb();

  const companyObj = companies.findById(id);

  if (!companyObj) {
    throw new DataNotFoundException('Компания не найдена');
  }

  //Удаляем все устройства, привязанные устройства и коды данной компании
  devices.data
    .filter((device) => device.companyId === id)
    ?.forEach((device) => {
      deviceBindings.data
        .filter((binding) => binding.deviceId === device.id)
        ?.forEach((binding) => deviceBindings.deleteById(binding.id));
      codes.data.filter((code) => code.deviceId === device.id)?.forEach((code) => deviceBindings.deleteById(code.id));
      devices.deleteById(device.id);
    });

  //Удаляем всех пользователей данной компании кроме Админа и Суперадмина
  users.data
    .filter((user) => user.company === id && user.role !== 'Admin' && user.role !== 'SuperAdmin')
    ?.forEach((user) => users.deleteById(user.id));

  const company = companies.findById(id);

  //Очищаем компанию у админа
  updateUserCompany(company.adminId, { id: company.adminId, company: undefined });

  companies.deleteById(id);

  return 'Компания удалена';
};

/**
 * Возвращает одну организацию
 * @param {string} id - идентификатор организации
 * @return company, организация
 * */
const findOne = (id: string): ICompany => {
  const { companies } = getDb();

  const company = companies.findById(id);

  if (!company) {
    throw new DataNotFoundException('Компания не найдена');
  }

  return makeCompany(company);
};

/**
 * Возвращает множество компаний по указанным параметрам
 * @param {string} param - параметры
 * @return company[], компании
 * */
const findAll = (params: Record<string, string | number>): ICompany[] => {
  const { companies } = getDb();

  let companyList;
  if (process.env.MOCK) {
    companyList = mockCompanies;
  } else {
    companyList = companies.data;
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

  return companyList?.map((company) => makeCompany(company));
};

/**
 * Возвращает пользователей организации
 * @param {string} id - идентификатор организации
 * @return users, пользователи
 * */

export const makeCompany = (company: IDBCompany): ICompany => {
  const { users, appSystems } = getDb();

  const admin = getNamedEntitySync(company.adminId, users.data);

  //Формируем список подсистем с INamedEntity объектами
  const namedAppSystems = company.appSystemIds?.map((s) => getNamedEntitySync(s, appSystems.data));

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: company.id,
    name: company.name,
    city: company.city,
    appSystems: namedAppSystems,
    admin,
    externalId: company.externalId,
    creationDate: company.creationDate,
    editionDate: company.editionDate,
  };
};

const getAppSystemIds = (namedAppSystems: IAppSystem[]) => {
  const appSystems = getDb().appSystems.data;

  // Проверяем есть ли в базе подсистемы
  return namedAppSystems.map(({ id }) => {
    if (!appSystems.findById(id)) {
      throw new DataNotFoundException(`Подсистема ${id} не найдена`);
    }
    return id;
  });
};

export { findOne, findAll, addOne, updateOne, deleteOne };
