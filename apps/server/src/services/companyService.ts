import { ICompany, IDBCompany, INamedEntity, NewCompany, IDBDevice, IAppSystem } from '@lib/types';

import { extraPredicate } from '../utils/helpers';

import { ConflictException, DataNotFoundException } from '../exceptions';

import { updateOne as updateUserCompany } from './userService';

import { getDb, createFolders } from './dao/db';

import { companies as mockCompanies } from './data/companies';

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
  const { companies, dbPath } = getDb();

  if (await companies.find((el) => el.name === company.name)) {
    throw new ConflictException('Компания уже существует');
  }

  // Проверяем есть ли в базе подсистемы
  const appSystemIds = company.appSystems ? await getAppSystemIds(company.appSystems) : undefined;

  const newCompanyObj = {
    name: company.name,
    city: company.city,
    appSystemIds,
    adminId: company.admin.id,
    externalId: company.externalId,
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  } as IDBCompany;

  const newCompany = await companies.insert(newCompanyObj);
  const createdCompany = await companies.find(newCompany);
  await createFolders(dbPath, createdCompany);

  await updateUserCompany(createdCompany.adminId, { id: createdCompany.adminId, company: createdCompany });

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

  // Проверяем есть ли в базе подсистемы
  const appSystemIds = companyData.appSystems ? await getAppSystemIds(companyData.appSystems) : undefined;

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

  const { companies, users, devices, codes, deviceBindings } = getDb();

  const companyObj = await companies.find(id);

  if (!companyObj) {
    throw new DataNotFoundException('Компания не найдена');
  }

  const devicesByCompany = await devices.read((item) => item.companyId === id);

  const delDevices = async (deviceList: IDBDevice[]) => {
    for (const item of deviceList) {
      // eslint-disable-next-line no-await-in-loop
      await deviceBindings.delete((b) => b.deviceId === item.id);
      // eslint-disable-next-line no-await-in-loop
      await codes.delete((c) => c.deviceId === item.id);
      // eslint-disable-next-line no-await-in-loop
      await devices.delete((i) => i.id === item.id);
    }
  };

  // const delDevices2 = async (deviceList: IDBDevice[]) => {
  //   const promises = deviceList.map(async (item) => {
  //     await deviceBindings.delete((b) => b.deviceId === item.id);
  //     await codes.delete((c) => c.deviceId === item.id);
  //     await devices.delete((i) => i.id === item.id);
  //   });
  //   await Promise.all(promises);
  // };

  delDevices(devicesByCompany);

  await users.delete((user) => user.company === id && user.role !== 'Admin' && user.role !== 'SuperAdmin');
  const company = await companies.find((adminCompany) => adminCompany.id === id);
  await updateUserCompany(company.adminId, { id: company.adminId, company: undefined });

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
  const { users, appSystems } = db;

  const admin = await users.find(company.adminId);

  const adminEntity: INamedEntity = admin && { id: admin.id, name: admin.name };

  //Формируем список подсистем с INamedEntity объектами
  const appSystemList = await appSystems.read();
  const namedAppSystems: INamedEntity[] | undefined = company.appSystemIds?.map((s) => {
    const system = appSystemList.find((i) => i.id === s)!;
    return { id: system?.id, name: system?.name };
  });

  /* TODO В звависимости от прав возвращать разный набор полей */
  return {
    id: company.id,
    name: company.name,
    city: company.city,
    appSystems: namedAppSystems,
    admin: adminEntity,
    externalId: company.externalId,
    creationDate: company.creationDate,
    editionDate: company.editionDate,
  };
};

const getAppSystemIds = async (namedAppSystems: IAppSystem[]) => {
  const appSystems = await getDb().appSystems.read();

  const appSystemIds: string[] = [];
  namedAppSystems.forEach((newSystem) => {
    if (!appSystems.find((s) => s.id === newSystem.id)) {
      throw new DataNotFoundException(`Подсистема ${newSystem.id} не найдена`);
    }
    appSystemIds.push(newSystem.id);
  });
  return appSystemIds;
};

export { findOne, findAll, addOne, updateOne, deleteOne };
