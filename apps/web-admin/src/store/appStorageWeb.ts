import { AppStorage, LoadDataFromDisk, SaveDataToDisk } from '@lib/store';

const dbDir = 'db';

export const appStorageWeb: AppStorage = {
  setItem: async (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.log('error setItem', e);
    }
  },
  getItem: async (key: string) => {
    try {
      const result = localStorage.getItem(key);
      return result ? JSON.parse(result) : null;
    } catch (e) {
      console.log('error getItem', e);
    }
  },

  removeItem: async (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.log('error removeItem', e);
    }
  },
};

export const loadDataFromDisk: LoadDataFromDisk = async (key: string, userId?: string) => {
  try {
    const fileName = `${dbDir}/${userId ? userId : ''}${key}`;
    const data = await appStorageWeb.getItem(fileName);
    console.log('loadDataFromDisk', fileName);
    return data;
  } catch (err) {
    console.log('err', err);
    return undefined;
  }
};

export const saveDataToDisk: SaveDataToDisk = async (key: string, newData: any, userId?: string) => {
  try {
    const fileName = `${dbDir}/${userId ? userId : ''}${key}`;
    await appStorageWeb.setItem(fileName, newData);
    console.log('saveDataToDisk', fileName);
  } catch (err) {
    console.log('err', err);
  }
};
