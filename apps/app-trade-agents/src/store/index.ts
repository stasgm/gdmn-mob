import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';

import geoReducer from './geo/reducer';
import { GeoActionType } from './geo/actions';
import appTradeReducer from './app/reducer';
import { AppTradeActionType } from './app/actions';
import { appTradeMiddleware } from './app/middleware';

export { default as geoActions } from './geo';

export { default as appTradeActions } from './app/actions.async';
export { useAppTradeThunkDispatch } from './app/actions.async';

type TActions = GeoActionType | AppTradeActionType;

export const combinedReducer = {
  appTrade: appTradeReducer,
  geo: geoReducer,
};

const rootReducer = combineReducers(combinedReducer);

export const { store } = configureStore(combinedReducer, [appTradeMiddleware]);

export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
