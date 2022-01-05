// /* eslint-disable @typescript-eslint/no-unused-vars-experimental */
// import * as FileSystem from 'expo-file-system';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// /**
//  * Одно из решений, как привязать AsyncStorage к пользователю,
//  * это создать свой объект, поддерживающий все методы интерфейса
//  * AsyncStorageStatic, который будет вызывать методы исходного
//  * AsyncStorage, подставляя в имя ключа ид пользователя.
//  *
//  * Тут могут возникнуть две проблемы:
//  * 1) до того, как у нас будет пользователь, данные будут сохраняться
//  *    в одни ключи (с пустым ИД пользователя), как только пользователь
//  *    возникнет -- в другие.
//  * 2) как удалять уже ненужные нам ключи? когда пользователь,
//  *    дерегистрируется в программе.
//  *
//  */

// const dbDir = `${FileSystem.documentDirectory}db/`;

// const getDirectory = (path: string): string => {
//   const regex = /^(.+)\/([^/]+)$/;
//   const res = regex.exec(path);

//   return res ? res[1] : path;
// };

// const ensureDirExists = async (dir: string) => {
//   const dirInfo = await FileSystem.getInfoAsync(`${dbDir}${dir}`);

//   if (!dirInfo.exists) {
//     await FileSystem.makeDirectoryAsync(`${dbDir}${dir}`, { intermediates: true });
//   }
// };

// const ensureFileExists = async (dir: string) => {
//   const dirInfo = await FileSystem.getInfoAsync(`${dbDir}${dir}`);
//   return dirInfo.exists;
// };

// class UserAsyncStorageClass {
//   private _userIdPrefix = '';
//   private _storage: typeof AsyncStorage;

//   constructor(storage: typeof AsyncStorage) {
//     this._storage = storage;
//   }

//   setUserId(userId: string) {
//     this._userIdPrefix = `${userId}\\`;
//   }

//   private _getUserPrefix(key: string) {
//     return key === 'persist:auth' ? key : `${this._userIdPrefix}${key}`;
//   }

//   getItem = (key: string, callback?: (error?: Error, result?: string) => void): Promise<string | null> => {
//     console.log('getItem 1', key);
//     const getData = async () => {
//       const userKey = this._getUserPrefix(key);
//       console.log('getItem 2', userKey);
//       try {
//         if (!(await ensureFileExists(`${userKey}.json`))) {
//           return;
//         }
//         await ensureDirExists(getDirectory(userKey));
//         const result = await FileSystem.readAsStringAsync(`${dbDir}${userKey}.json`);
//         // return result ? JSON.parse(result) : null;
//         return result ? JSON.parse(result) : null;
//       } catch (e) {
//         console.log('error', e);
//       }
//     };
//     return getData();
//   };

//   // this._storage.getItem(this._getUserPrefix(key), callback);

//   setItem = (key: string, value: string, callback?: (error?: Error) => void): Promise<void> => {
//     console.log('setItem 1', key);
//     const saveData = async () => {
//       const userKey = this._getUserPrefix(key);
//       console.log('setItem 2', userKey, value);
//       try {
//         await ensureDirExists(getDirectory(userKey));
//         await FileSystem.writeAsStringAsync(`${dbDir}${userKey}.json`, value);
//       } catch (e) {
//         console.log('error', e);
//       }
//     };
//     return saveData();
//   };
//   //this._storage.setItem(this._getUserPrefix(key), value, callback);

//   removeItem = (key: string, callback?: (error?: Error) => void): Promise<void> => {
//     console.log('removeItem 1', key);
//     const removeData = async () => {
//       const userKey = this._getUserPrefix(key);
//       console.log('removeItem 2', userKey);
//       try {
//         await ensureDirExists('');
//         await FileSystem.deleteAsync(`${dbDir}${userKey}.json`);
//       } catch (e) {
//         console.log('error', e);
//       }
//     };
//     return removeData();
//   };

//   //this._storage.removeItem(this._getUserPrefix(key), callback);

//   mergeItem = (key: string, value: string, callback?: (error?: Error) => void): Promise<void> => {
//     console.log('mergeItem', this._getUserPrefix(key));
//     return this._storage.mergeItem(this._getUserPrefix(key), value, callback);
//   };

//   clear = (callback?: (error?: Error) => void): Promise<void> => {
//     console.log('clear');
//     return this._storage.clear(callback);
//   };

//   getAllKeys = (callback?: (error?: Error, keys?: string[]) => void): Promise<string[]> => {
//     console.log('getAllKeys');
//     return this._storage.getAllKeys(callback);
//   };

//   multiGet = (
//     keys: string[],
//     callback?: (errors?: Error[], result?: [string, string | null][]) => void,
//   ): Promise<[string, string | null][]> => {
//     console.log('multiGet');
//     return this._storage.multiGet(keys, callback);
//   };

//   multiSet = (keyValuePairs: string[][], callback?: (errors?: Error[]) => void): Promise<void> => {
//     console.log('multiSet', keyValuePairs);
//     return this._storage.multiSet(keyValuePairs, callback);
//   };

//   multiRemove = (keys: string[], callback?: (errors?: Error[]) => void): Promise<void> => {
//     console.log('multiRemove', keys);
//     return this._storage.multiRemove(
//       keys.map((key) => this._getUserPrefix(key)),
//       callback,
//     );
//   };

//   multiMerge = (keyValuePairs: string[][], callback?: (errors?: Error[]) => void): Promise<void> => {
//     console.log('multiMerge', keyValuePairs);
//     return this._storage.multiMerge(
//       keyValuePairs.map((keys) => keys.map((key) => this._getUserPrefix(key))),
//       callback,
//     );
//   };
// }

// export const UserAsyncStorage = new UserAsyncStorageClass(AsyncStorage);
