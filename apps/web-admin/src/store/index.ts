import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';

import companyReducer from './company/reducer';
import { CompanyActionType } from './company/actions';
import userReducer from './user/reducer';
import deviceReducer from './device/reducer';
import { DeviceActionType } from './device/actions';
import { UserActionType } from './user/actions';

export const reducers = {
  companies: companyReducer,
  users: userReducer,
  devices: deviceReducer,
};

type TActions = CompanyActionType | DeviceActionType | UserActionType;

const rootReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof rootReducer> & RootState;
export const { store } = configureStore(reducers);

export type AppDispatch = ThunkDispatch<AppState & RootState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();
