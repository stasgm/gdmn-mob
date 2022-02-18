import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';
import { loadDataFromDisk, saveDataToDisk } from '@lib/mobile-app';

import appMovementReducer from './app/reducer';
import { AppMovementActionType } from './app/actions';
import { appMovMiddlewareFactory } from './app/middleware';

export { default as appMovementActions } from './app';

type TActions = AppMovementActionType;

export const reducers = {
  appMovement: appMovementReducer,
};

const appReducer = combineReducers(reducers);

export const { store } = configureStore(loadDataFromDisk, saveDataToDisk, reducers, [], [appMovMiddlewareFactory]);

export type AppState = ReturnType<typeof appReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
