import { IAppSystem, DBAppSystem, NewAppSystem } from '@lib/types';

import { ConflictException, DataNotFoundException } from '../exceptions';

import { extraPredicate } from '../utils/helpers';

import { appSystems as mockAppSystems } from './data/appSystems';

import { getDb } from './dao/db';

const addOne = async (appSystem: NewAppSystem): Promise<IAppSystem> => {
  /*
    1. Проверяем что организация существует
    2. Добавляем организацию
    3. К текущему пользователю записываем созданную организацию
    4. К администратору добавляем созданную организацию
  */
  const { appSystems } = getDb();

  if (await appSystems.find((el) => el.name === appSystem.name)) {
    throw new ConflictException('Подсистема уже существует');
  }

  const newAppSystemObj = {
    id: '',
    name: appSystem.name,
    description: appSystem.description || '',
    creationDate: new Date().toISOString(),
    editionDate: new Date().toISOString(),
  } as DBAppSystem;

  const newAppSystem = await appSystems.insert(newAppSystemObj);

  return await appSystems.find(newAppSystem);
};

const updateOne = async (id: string, appSystemData: Partial<IAppSystem>): Promise<IAppSystem> => {
  const db = getDb();
  const { appSystems } = db;

  const appSystemObj = await appSystems.find(id);

  if (!appSystemObj) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  if (await appSystems.find((el) => el.name === appSystemData.name && el.id !== appSystemData.id)) {
    throw new ConflictException('Подсистема уже существует');
  }

  const newAppSystem: DBAppSystem = {
    id,
    name: appSystemData.name || appSystemObj.name,
    description: appSystemData.description === undefined ? appSystemObj.description : appSystemData.description,
    creationDate: appSystemObj.creationDate,
    editionDate: new Date().toISOString(),
  };

  await appSystems.update(newAppSystem);

  return await appSystems.find(id);
};

const deleteOne = async (id: string): Promise<void> => {
  const db = getDb();
  const { appSystems } = db;

  if (!(await appSystems.find((d) => d.id === id))) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  await appSystems.delete((d) => d.id === id);
};

const findOne = async (id: string): Promise<IAppSystem | undefined> => {
  const { appSystems } = getDb();

  const appSystem = await appSystems.find(id);

  if (!appSystem) {
    throw new DataNotFoundException('Подсистема не найдена');
  }

  return appSystem;
};

const findAll = async (params: Record<string, string | number>): Promise<IAppSystem[]> => {
  const { appSystems } = getDb();

  let appSystemList;
  if (process.env.MOCK) {
    appSystemList = mockAppSystems;
  } else {
    appSystemList = await appSystems.read();
  }

  appSystemList = appSystemList.filter((item) => {
    const newParams = (({ fromRecord, toRecord, ...others }) => others)(params);

    /* filtering data */
    let filteredAppSystems = true;
    if ('filterText' in newParams) {
      const filterText: string = (newParams.filterText as string).toUpperCase();

      if (filterText) {
        const name = item.name.toUpperCase();
        const description = item.description?.toUpperCase() || '';
        const creationDate = new Date(item.creationDate || '').toLocaleString('ru', { hour12: false });
        const editionDate = new Date(item.editionDate || '').toLocaleString('ru', { hour12: false });

        filteredAppSystems =
          name.includes(filterText) ||
          description.includes(filterText) ||
          creationDate.includes(filterText) ||
          editionDate.includes(filterText);
      }
      delete newParams['filterText'];
    }

    return filteredAppSystems && extraPredicate(item, newParams as Record<string, string>);
  });

  /* pagination */
  const limitParams = Object.assign({}, params);

  let fromRecord = 0;
  if ('fromRecord' in limitParams) {
    fromRecord = limitParams.fromRecord as number;
  }

  let toRecord = appSystemList.length;
  if ('toRecord' in limitParams)
    toRecord = (limitParams.toRecord as number) > 0 ? (limitParams.toRecord as number) : toRecord;

  return appSystemList.slice(fromRecord, toRecord);
};

export { addOne, updateOne, deleteOne, findOne, findAll };
