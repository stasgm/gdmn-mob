import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';

import { persistStore } from 'redux-persist';

import companyReducer from './company/reducer';
import { CompanyActionType } from './company/actions';
import userReducer from './user/reducer';
import deviceReducer from './device/reducer';
import activationCodeReducer from './activationCode/reducer';
import deviceBindingReducer from './deviceBinding/reducer';
import { DeviceActionType } from './device/actions';
import { ActivationCodeActionType } from './activationCode/actions';
import { UserActionType } from './user/actions';
import { DeviceBindingActionType } from './deviceBinding/actions';

export const reducers = {
  companies: companyReducer,
  users: userReducer,
  devices: deviceReducer,
  activationCodes: activationCodeReducer,
  deviceBindings: deviceBindingReducer,
};

type TActions =
  | CompanyActionType
  | DeviceActionType
  | ActivationCodeActionType
  | UserActionType
  | DeviceBindingActionType;

const rootReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof rootReducer> & RootState;
export const { store } = configureStore(reducers);
export const persistor = persistStore(store);

export type AppDispatch = ThunkDispatch<AppState & RootState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();
