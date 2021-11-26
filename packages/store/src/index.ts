import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { Reducer, createStore, combineReducers, applyMiddleware, AnyAction } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { StateType } from 'typesafe-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistReducer } from 'redux-persist';

import { reducer as documentReducer } from './documents';
import { reducer as authReducer } from './auth';
import { reducer as referenceReducer } from './references';
import { reducer as settingsReducer } from './settings';
import { reducer as msgReducer } from './messages';
import { reducer as appReducer } from './app';
import { TActions } from './types';

/**
 * Одно из решений, как привязать AsyncStorage к пользователю,
 * это создать свой объект, поддерживающий все методы интерфейса
 * AsyncStorageStatic, который будет вызывать методы исходного
 * AsyncStorage, подставляя в имя ключа ид пользователя.
 *
 * Тут могут возникнуть две проблемы:
 * 1) до того, как у нас будет пользователь, данные будут сохраняться
 *    в одни ключи (с пустым ИД пользователя), как только пользователь
 *    возникнет -- в другие.
 * 2) как удалять уже ненужные нам ключи? когда пользователь,
 *    дерегистрируется в программе.
 *
 */

class UserAsyncStorageClass {
  private _userIdPrefix: string = '';
  private _storage: typeof AsyncStorage;

  constructor(storage: typeof AsyncStorage) {
    this._storage = storage;
  }

  setUserId(userId: string) {
    this._userIdPrefix = `${userId}\\`;
  }

  private _getUserPrefix(key: string) {
    return `${this._userIdPrefix}${key}`;
  }

  getItem = (key: string, callback?: (error?: Error, result?: string) => void): Promise<string | null> =>
    this._storage.getItem(this._getUserPrefix(key), callback);

  setItem = (key: string, value: string, callback?: (error?: Error) => void): Promise<void> =>
    this._storage.setItem(this._getUserPrefix(key), value, callback);

  removeItem = (key: string, callback?: (error?: Error) => void): Promise<void> =>
    this._storage.removeItem(this._getUserPrefix(key), callback);

  mergeItem = (key: string, value: string, callback?: (error?: Error) => void): Promise<void> =>
    this._storage.mergeItem(this._getUserPrefix(key), value, callback);

  clear = (callback?: (error?: Error) => void): Promise<void> =>
    this._storage.clear(callback);

  getAllKeys = (callback?: (error?: Error, keys?: string[]) => void): Promise<string[]> =>
    this._storage.getAllKeys(callback);

  multiGet = (
      keys: string[],
      callback?: (errors?: Error[], result?: [string, string | null][]) => void
    ): Promise<[string, string | null][]> =>
    this._storage.multiGet(keys, callback);

  multiSet = (keyValuePairs: string[][], callback?: (errors?: Error[]) => void): Promise<void> =>
    this._storage.multiSet(keyValuePairs, callback);

  multiRemove = (keys: string[], callback?: (errors?: Error[]) => void): Promise<void> =>
    this._storage.multiRemove(keys, callback);
};

const UserAsyncStorage = new UserAsyncStorageClass(AsyncStorage);

const persistAuthConfig = {
  key: 'auth',
  storage: UserAsyncStorage,
  whitelist: ['user', 'settings', 'company', 'device'],
};

const persistDocsConfig = {
  key: 'documents',
  storage: AsyncStorage,
  whitelist: ['list'],
};

const persistRefsConfig = {
  key: 'references',
  storage: AsyncStorage,
  whitelist: ['list'],
};

const persistSettingsConfig = {
  key: 'settings',
  storage: AsyncStorage,
  whitelist: ['data'],
};

const persistAppConfig = {
  key: 'app',
  storage: AsyncStorage,
  whitelist: ['formParams', 'errorList'],
};

export const rootReducer = {
  auth: persistReducer(persistAuthConfig, authReducer),
  // auth: authReducer,
  messages: msgReducer,
  references: persistReducer(persistRefsConfig, referenceReducer),
  documents: persistReducer(persistDocsConfig, documentReducer),
  settings: persistReducer(persistSettingsConfig, settingsReducer),
  app: persistReducer(persistAppConfig, appReducer),
};

type AppReducers<S, A extends AnyAction> = { [key: string]: Reducer<S, A> };

const createReducer = <S, A extends AnyAction>(asyncReducers: AppReducers<S, A>) => {
  return combineReducers({ ...rootReducer, ...asyncReducers });
};

// <S, A extends AnyAction>
export default function configureStore(appReducers: AppReducers<any, AnyAction>) {
  const middleware = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middleware);

  const store = createStore(createReducer(appReducers), composeWithDevTools(middleWareEnhancer));
  return { store };
}

export type RootState = StateType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, any, TActions>; // TActions

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
