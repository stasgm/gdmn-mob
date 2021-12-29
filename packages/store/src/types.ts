import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { AuthActionType } from './auth/actions';
import { DocumentActionType } from './documents/actions';
import { MsgActionType } from './messages/actions';
import { ReferenceActionType } from './references/actions';
import { SettingsActionType } from './settings/actions';

export type TActions = AuthActionType | MsgActionType | ReferenceActionType | DocumentActionType | SettingsActionType;

export type AppThunk<ReturnType = void, S = void, A extends AnyAction = AnyAction> = ThunkAction<
  ReturnType,
  S,
  unknown,
  A
>;

export interface AppStorage<T = any> {
  setItem: (key: string, data: T) => Promise<void>;
  getItem: (key: string) => Promise<T>;
  removeItem: (key: string) => Promise<void>;
}

export type LoadDataFromDisk = (key: string, userId?: string) => Promise<any>;
export type SaveDataToDisk = (key: string, newData: any, userId?: string) => Promise<void>;

/**
 * Мидлвэр для записи и восстановления стэйт из кэша (локального хранилища)
 */
export type PersistedMiddleware = (load: LoadDataFromDisk, save: SaveDataToDisk) => (action: any) => any;
