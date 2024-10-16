import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';

import companyReducer from './company/reducer';
import { CompanyActionType } from './company/actions';
import userReducer from './user/reducer';
import deviceReducer from './device/reducer';
import activationCodeReducer from './activationCode/reducer';
import deviceBindingReducer from './deviceBinding/reducer';
import appSystemReducer from './appSystem/reducer';
import processReducer from './process/reducer';
import deviceLogReducer from './deviceLog/reducer';
import fileReducer from './file/reducer';
import serverLogReducer from './serverLog/reducer';
import { DeviceActionType } from './device/actions';
import { ActivationCodeActionType } from './activationCode/actions';
import { UserActionType } from './user/actions';
import { DeviceBindingActionType } from './deviceBinding/actions';
import { AppSystemActionType } from './appSystem/actions';
import { ProcessActionType } from './process/actions';
import { DeviceLogActionType } from './deviceLog/actions';
import { FileSystemActionType } from './file/actions';
import { ServerLogActionType } from './serverLog/actions';
import { loadDataFromDisk, saveDataToDisk } from './appStorageWeb';

export const reducers = {
  companies: companyReducer,
  users: userReducer,
  devices: deviceReducer,
  activationCodes: activationCodeReducer,
  deviceBindings: deviceBindingReducer,
  appSystems: appSystemReducer,
  processes: processReducer,
  deviceLogs: deviceLogReducer,
  files: fileReducer,
  serverLogs: serverLogReducer,
};

type TActions =
  | CompanyActionType
  | DeviceActionType
  | ActivationCodeActionType
  | UserActionType
  | DeviceBindingActionType
  | AppSystemActionType
  | ProcessActionType
  | DeviceLogActionType
  | FileSystemActionType
  | ServerLogActionType;

const appReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof appReducer> & RootState;
export const { store } = configureStore(loadDataFromDisk, saveDataToDisk, reducers, [], []);

export type AppDispatch = ThunkDispatch<AppState & RootState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();
