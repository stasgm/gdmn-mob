import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';
import { loadDataFromDisk, saveDataToDisk } from '@lib/mobile-app';

import appInventoryReducer from './app/reducer';
import { AppInventoryActionType } from './app/actions';
import { appInvMiddlewareFactory } from './app/middleware';

export { default as appInventoryActions } from './app';
export { useAppInventoryThunkDispatch } from './app/actions.async';

type TActions = AppInventoryActionType;

export const reducers = {
  appInventory: appInventoryReducer,
};

const appReducer = combineReducers(reducers);

export const { store } = configureStore(loadDataFromDisk, saveDataToDisk, reducers, [], [appInvMiddlewareFactory]);

export type AppState = ReturnType<typeof appReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
