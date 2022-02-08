import { AppStorage, LoadDataFromDisk, SaveDataToDisk } from '@lib/store';

const dbDir = 'db';

export const appStorageWeb: AppStorage = {
  setItem: async (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  getItem: async (key: string) => {
    const result = localStorage.getItem(key);
    return result ? JSON.parse(result) : null;
  },
  removeItem: async (key: string) => {
    localStorage.removeItem(key);
  },
};

export const loadDataFromDisk: LoadDataFromDisk = async (key: string, userId?: string) => {
  const fileName = `${dbDir}/${userId ? userId : ''}${key}`;
  try {
    const data = await appStorageWeb.getItem(fileName);
    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Ошибка при загрузке данных из диска ${fileName}: ${err.message}`);
    } else {
      throw err;
    }
  }
};

export const saveDataToDisk: SaveDataToDisk = async (key: string, newData: any, userId?: string) => {
  const fileName = `${dbDir}/${userId ? userId : ''}${key}`;
  try {
    await appStorageWeb.setItem(fileName, newData);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Ошибка при сохранении данных на диск ${fileName}: ${err.message}`);
    } else {
      throw err;
    }
  }
};
