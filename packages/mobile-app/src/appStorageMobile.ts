import * as FileSystem from 'expo-file-system';

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
    await ensureDirExists(getDirectory(key));
    await FileSystem.writeAsStringAsync(`${dbDir}${key}.json`, JSON.stringify(data));
  },

  getItem: async (key: string) => {
    if (!(await ensureFileExists(`${key}.json`))) {
      return;
    }
    await ensureDirExists(getDirectory(key));
    const result = await FileSystem.readAsStringAsync(`${dbDir}${key}.json`);
    return result ? JSON.parse(result) : null;
  },

  removeItem: async (key: string) => {
    await ensureDirExists('');
    await FileSystem.deleteAsync(`${dbDir}${key}.json`);
  },
};

export const loadDataFromDisk: LoadDataFromDisk = async (key: string, userId?: string) => {
  const fileName = userId ? `${userId}/${key}` : key;
  try {
    const data = await appStorage.getItem(fileName);
    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Ошибка при загрузке данных из диска ${key}: ${err.message}`);
    } else {
      throw err;
    }
  }
};

export const saveDataToDisk: SaveDataToDisk = async (key: string, newData: any, userId?: string) => {
  const fileName = userId ? `${userId}/${key}` : key;
  try {
    await appStorage.setItem(fileName, newData);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Ошибка при сохранении данных на диск ${key}: ${err.message}`);
    } else {
      throw err;
    }
  }
};
