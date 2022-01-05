//TODO: это реализация записи в локальные файлы через экспо. надо переместить в папку мобильного решения

import * as FileSystem from 'expo-file-system';

// export interface AppStorage<T = any> {
//   setItem: (key: string, data: T) => Promise<void>;
//   getItem: (key: string) => Promise<T>;
//   removeItem: (key: string) => Promise<void>;
// }

// export type LoadDataFromDisk = (key: string, userId?: string) => Promise<any>;
// export type SaveDataToDisk = (key: string, newData: any, userId?: string) => Promise<void>;

// /**
//  * Мидлвэр для записи и восстановления стэйт из кэша (локального хранилища)
//  */
// export type PersistedMiddleware = (load: LoadDataFromDisk, save: SaveDataToDisk) => (action: any) => any;


import { AppStorage, LoadDataFromDisk, SaveDataToDisk } from '@lib/store';

const dbDir = `${FileSystem.documentDirectory}db/`;

const getDirectory = (path: string): string => {
  const regex = /^(.+)\/([^/]+)$/;
  const res = regex.exec(path);

  return res ? res[1] : path;
};

const ensureDirExists = async (dir: string) => {
  const dirInfo = await FileSystem.getInfoAsync(`${dbDir}${dir}`);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(`${dbDir}${dir}`, { intermediates: true });
  }
};

const ensureFileExists = async (dir: string) => {
  const dirInfo = await FileSystem.getInfoAsync(`${dbDir}${dir}`);
  return dirInfo.exists;
};

export const appStorage: AppStorage = {
  setItem: async (key: string, data: any) => {
    try {
      await ensureDirExists(getDirectory(key));
      await FileSystem.writeAsStringAsync(`${dbDir}${key}.json`, JSON.stringify(data));
    } catch (e) {
      console.log('error', e);
    }
  },

  getItem: async (key: string) => {
    try {
      if (!(await ensureFileExists(`${key}.json`))) {
        return;
      }
      await ensureDirExists(getDirectory(key));
      const result = await FileSystem.readAsStringAsync(`${dbDir}${key}.json`);
      return result ? JSON.parse(result) : null;
    } catch (e) {
      console.log('error', e);
    }
  },

  removeItem: async (key: string) => {
    try {
      await ensureDirExists('');
      await FileSystem.deleteAsync(`${dbDir}${key}.json`);
    } catch (e) {
      console.log('error', e);
    }
  },
};

export const loadDataFromDisk: LoadDataFromDisk = async (key: string, userId?: string) => {
  try {
    const fileName = userId ? `${userId}/${key}` : key;
    const data = await appStorage.getItem(fileName);
    console.log('loadDataFromDisk', fileName);
    return data;
  } catch (err) {
    console.log('err', err);
    return undefined;
  }
};

export const saveDataToDisk: SaveDataToDisk = async (key: string, newData: any, userId?: string) => {
  try {
    const fileName = userId ? `${userId}/${key}` : key;
    await appStorage.setItem(fileName, newData);
    console.log('saveDataToDisk', fileName);
  } catch (err) {
    console.log('err', err);
  }
};
