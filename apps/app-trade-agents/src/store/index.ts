import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';
import { loadDataFromDisk, saveDataToDisk } from '@lib/mobile-app';

import geoReducer from './geo/reducer';
import { GeoActionType } from './geo/actions';
import appTradeReducer from './app/reducer';
import { AppTradeActionType } from './app/actions';
import { appTradeMiddlewareFactory } from './app/middleware';

export { default as geoActions } from './geo';

export { default as appTradeActions } from './app';
export { useAppTradeThunkDispatch } from './app/actions.async';

type TActions = GeoActionType | AppTradeActionType;

export const combinedReducer = {
  appTrade: appTradeReducer,
  geo: geoReducer,
};

const rootReducer = combineReducers(combinedReducer);

export const { store } = configureStore(
  loadDataFromDisk,
  saveDataToDisk,
  combinedReducer,
  [],
  [appTradeMiddlewareFactory],
);

export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
