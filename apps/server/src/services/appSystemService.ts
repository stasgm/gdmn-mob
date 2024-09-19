import { IAppSystem, NewAppSystem } from '@lib/types';

import { ConflictException, DataNotFoundException } from '../exceptions';

import { extraPredicate, formatDateToLocale, getListPart } from '../utils';

import { appSystems as mockAppSystems } from './data/appSystems';

import { getDb } from './dao/db';

/**
 * Добавление новой подсистемы
 * @param appSystemData Данные новой подсистемы
 * @returns Созданный объект подсистемы
 */
const addOne = (appSystemData: NewAppSystem): IAppSystem => {
  /*
    1. Проверяем что организация существует
    2. Добавляем организацию
    3. К текущему пользователю записываем созданную организацию
    4. К администратору добавляем созданную организацию
  */
  const { appSystems } = getDb();

  if (appSystems.data.find((el) => el.name === appSystemData.name)) {
    throw new ConflictException(`Подсистема с наименованием ${appSystemData.name} уже существует`);
  }

  return appSystems.insert({
    id: '',
    name: appSystemData.name,
    description: appSystemData.description || '',
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  });
};

/**
 * Обновляет подсистему по ИД
 * @param id ИД подсистемы
 * @param appSystemData Новые данные подсистемы
 * @returns Обновленный объект подсистемы
 */
const updateOne = (id: string, appSystemData: Partial<IAppSystem>): IAppSystem => {
  const { appSystems } = getDb();

  const appSystemObj = appSystems.findById(id);

  if (!appSystemObj) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  if (appSystems.data.find((el) => el.name === appSystemData.name && el.id !== appSystemData.id)) {
    throw new ConflictException(`Подсистема с названием ${appSystemData.name} уже существует`);
  }

  appSystems.update({
    id,
    name: appSystemData.name || appSystemObj.name,
    description: appSystemData.description === undefined ? appSystemObj.description : appSystemData.description,
    creationDate: appSystemObj.creationDate,
    editionDate: new Date().toISOString(),
  });

  const updatedAppSystem = appSystems.findById(id);

  if (!updatedAppSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  return updatedAppSystem;
};

/**
 * Удаляет подсистему по ИД
 * @param id ИД подсистемы
 */
const deleteOne = (id: string): void => {
  const { appSystems } = getDb();

  if (!appSystems.findById(id)) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  appSystems.deleteById(id);
};

/**
 * Возвращает подсистему по ИД
 * @param id ИД подсистемы
 * @returns Объект найденной подсистемы
 */
const findOne = (id: string): IAppSystem => {
  const appSystem = getDb().appSystems.findById(id);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  return appSystem;
};

/**
 * Возвращает множество подсистем по указанным параметрам
 * @param params Параметры поиска
 * @returns Массив объектов подсистем
 */
const findMany = (params: Record<string, string | number>): IAppSystem[] => {
  let appSystemList;
  if (process.env.MOCK) {
    appSystemList = mockAppSystems;
  } else {
    appSystemList = getDb().appSystems.data;
  }

  appSystemList = appSystemList.filter((item) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fromRecord, toRecord, ...newParams } = params;

    let companyFound = true;

    if ('companyId' in newParams) {
      companyFound = !!getDb().companies.data.find(
        (company) => company.id === newParams.companyId && company.appSystemIds?.includes(item.id),
      );
      delete newParams['companyId'];
    }

    /* filtering data */
    let filteredAppSystems = true;
    if ('filterText' in newParams) {
      const filterText: string = (newParams.filterText as string).toUpperCase();

      if (filterText) {
        const name = item.name.toUpperCase();
        const description = item.description?.toUpperCase() || '';
        const creationDate = formatDateToLocale(item.creationDate);
        const editionDate = formatDateToLocale(item.editionDate);

        filteredAppSystems =
          name.includes(filterText) ||
          description.includes(filterText) ||
          creationDate.includes(filterText) ||
          editionDate.includes(filterText);
      }
      delete newParams['filterText'];
    }

    return filteredAppSystems && companyFound && extraPredicate(item, newParams as Record<string, string>);
  });

  return getListPart<IAppSystem>(appSystemList, params);
};

export { addOne, updateOne, deleteOne, findOne, findMany };
