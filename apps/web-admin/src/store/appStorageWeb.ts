
import { AppStorage, LoadDataFromDisk, SaveDataToDisk } from '@lib/store';

const dbDir = 'db/'

export const appStorageWeb: AppStorage = {
  setItem: async (key: string, data: any) => {

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.log('error', e);
    }
  },
  getItem: async (key: string, check?: any) => {
    try {
      const result = localStorage.getItem(key);
      return result ? JSON.parse(result) : null;
    } catch (e) {
      console.log('error', e);
    }
  },

  removeItem: async (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.log('error', e);
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
    const fileName = userId ? `${userId}/${key}` : key;
    await appStorageWeb.setItem(fileName, newData);
    console.log('saveDataToDisk', fileName);
  } catch (err) {
    console.log('err', err);
  }
};



// import path from 'path';
// import fs from 'fs';

// import { AppStorage, LoadDataFromDisk, SaveDataToDisk } from '@lib/store';

// // const dbDir = `${FileSystem.documentDirectory}db/`;

// export const getFN = (key: string) => path.resolve(process.cwd(), `db/${key}.json`);

// // const getDirectory = (path: string): string => {
// //   const regex = /^(.+)\/([^/]+)$/;
// //   const res = regex.exec(path);

// //   return res ? res[1] : path;
// // };

// // const ensureDirExists = async (dir: string) => {
// //   const dirInfo = await FileSystem.getInfoAsync(`${dbDir}${dir}`);

// //   if (!dirInfo.exists) {
// //     await FileSystem.makeDirectoryAsync(`${dbDir}${dir}`, { intermediates: true });
// //   }
// // };

// // const ensureFileExists = async (dir: string) => {
// //   const dirInfo = await FileSystem.getInfoAsync(`${dbDir}${dir}`);
// //   return dirInfo.exists;
// // };

// export const appStorageWeb: AppStorage = {
//   setItem: async (key: string, data: any) => {
//     const fileName = getFN(key);
//     const dirName = path.dirname(fileName);

//     try {
//       if (!fs.existsSync(dirName)) {
//         // создадим папку, если она не существует
//         fs.mkdirSync(dirName, { recursive: true });
//       }

//       fs.writeFileSync(fileName, JSON.stringify(data), { encoding: 'utf8' });
//     } catch (e) {
//       console.log('error', e);
//     }
//   },
//   getItem: async (key: string, check?: any) => {
//     // try {
//     //   if (!(await ensureFileExists(`${key}.json`))) {
//     //     return;
//     //   }
//     //   await ensureDirExists(getDirectory(key));
//     //   const result = await FileSystem.readAsStringAsync(`${dbDir}${key}.json`);
//     //   return result ? JSON.parse(result) : null;
//     // } catch (e) {
//     //   console.log('error', e);
//     // }

//     // check: (data: IData<ICurrency>) => !Object.keys(data).length
//     //   || (typeof Object.values(data)[0].abbreviation === 'string'
//     // && typeof Object.values(data)[0].name === 'object'),
//     const fileName = getFN(key);
//     // const dirName = path.dirname(fileName);

//     if (fs.existsSync(fileName)) {
//       let result;

//       try {
//         result = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf8' }));
//         if (typeof result.data === 'object') {
//           const data = result ? JSON.parse(result) : null;

//           if (!check || check(data)) {
//             return data;
//           }
//         }
//       } catch (e) {
//         console.log('error', e);
//       }
//     }

//     // if (!this._data) {
//     //   this._data = this._initData;
//     // }
//   },

//   removeItem: async (key: string) => {
//     // try {
//     //   await ensureDirExists('');
//     //   await FileSystem.deleteAsync(`${dbDir}${key}.json`);
//     // } catch (e) {
//     //   console.log('error', e);
//     // }
//   },
// };

// export const loadDataFromDisk: LoadDataFromDisk = async (key: string, userId?: string) => {
//   try {
//     const fileName = userId ? `${userId}/${key}` : key;
//     const data = await appStorageWeb.getItem(fileName);
//     console.log('loadDataFromDisk', fileName);
//     return data;
//   } catch (err) {
//     console.log('err', err);
//     return undefined;
//   }
// };

// export const saveDataToDisk: SaveDataToDisk = async (key: string, newData: any, userId?: string) => {
//   try {
//     const fileName = userId ? `${userId}/${key}` : key;
//     await appStorageWeb.setItem(fileName, newData);
//     console.log('saveDataToDisk', fileName);
//   } catch (err) {
//     console.log('err', err);
//   }
// };
