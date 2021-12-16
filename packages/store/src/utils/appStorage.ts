import * as FileSystem from 'expo-file-system';

import { AuthState } from '../auth/types';

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

export const appStorage = {
  setItem: async <T>(key: string, data: T) => {
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

export const loadState = async () => {
  try {
    const state: any | null = await appStorage.getItem('state');
    if (!state.auth.user) {
      console.log('loadState 1', { auth: state.auth });
      return state ? { auth: state.auth } : undefined;
    }

    const userId = state.auth.user.id;
    const userStore = Object.entries(state).reduce((prev: any, cur: any) => {
      if (!cur[0].includes(`${userId}/` && cur[0] !== 'auth')) {
        return prev;
      }
      const key = cur[0].replace(`${userId}/`, '');
      prev[key] = cur[1];
      return prev;
    }, {});

    console.log('loadState 2', userStore.auth?.user?.id, userStore.documents?.list?.length);

    return userStore;
  } catch (err) {
    console.log('err', err);
    return undefined;
  }
};

export const saveState = async (state: any) => {
  try {
    if (!state.auth.user) {
      console.log('saveState 1', { auth: state.auth });
      await appStorage.setItem('state', { auth: state.auth });
      return;
    }
    const userId = state.auth.user.id;
    const userStore = Object.entries(state).reduce((prev: any, cur: any) => {
      if (cur[0] === 'auth') {
        prev[cur[0]] = cur[1];
        return prev;
      }
      prev[`${userId}/${cur[0]}`] = cur[1];
      return prev;
    }, {});
    const newState = { auth: state.auth, ...userStore };
    console.log('saveState 2', newState.auth?.user?.id, newState.documents?.list?.length);
    await appStorage.setItem('state', newState);
  } catch (err) {
    console.log('err', err);
  }
};

// const loadData = async () => {
//   console.log('Load data', 'Начало загрузки данных из Storage');
//   // console.log('loadData');
//   // setLoading(true);
//   // настройки приложения
//   const storageSettings: IAppSettings = await appStorage.getItem(`${storagePath}/${sections.SETTINGS}`);
//   actions.setSettings(storageSettings);
//   // настройки компании
//   const storageCompanySettings: ICompanySettings = await appStorage.getItem(
//     `${storagePath}/${sections.COMPANYSETTINGS}`,
//   );
//   const weightSettings = storageCompanySettings?.weightSettings ?? config.system[0].weightSettings;
//   actions.setCompanySettings(
//     storageCompanySettings
//       ? {
//           ...storageCompanySettings,
//           weightSettings,
//         }
//       : { weightSettings },
//   );
//   // Справочники
//   const references = (await appStorage.getItem(`${storagePath}/${sections.REFERENCES}`)) as IReferences;
//   actions.setReferences(references);

//   if (references?.contacts?.data && references?.goods?.data) {
//     console.log('getRemainsModel', 'Начало построения модели');
//     console.log('запись в хранилище', 'Начало построения модели',
// !!references?.contacts?.data, !!references?.goods?.data, !!references?.remains?.data);

//     const remainsModel: IModel<IModelData<IMDGoodRemain>> = await getRemainsModel(
//       references?.contacts?.data as IContact[],
//       references?.goods?.data as IGood[],
//       (references?.remains?.data as unknown) as IRemains[],
//     );
//     console.log('getRemainsModel', 'Окончание построения модели');
//     actions.setModel(remainsModel);
//   }
//   // документы
//   const documents = (await appStorage.getItem(`${storagePath}/${sections.DOCUMENTS}`)) as IDocument[];
//   actions.setDocuments(documents);

//   // viewParams
//   const viewParams = (await appStorage.getItem(`${storagePath}/${sections.VIEWPARAMS}`)) as IViewParams;
//   actions.setViewParams(viewParams);

//   console.log('Load data', 'Окончание загрузки данных из Storage');
//   // setLoading(false);
// };
