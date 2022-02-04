import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';
import { loadDataFromDisk, saveDataToDisk } from '@lib/mobile-app';

import reducer from './app/reducer';
import { AppActionType } from './app/actions';
import { appInvMiddlewareFactory } from './app/middleware';

export { default as appActions } from './app';
export { useAppThunkDispatch } from './app/actions.async';

type TActions = AppActionType;

export const reducers = {
  appDynInventory: reducer,
};

const appReducer = combineReducers(reducers);

export const { store } = configureStore(loadDataFromDisk, saveDataToDisk, reducers, [], [appInvMiddlewareFactory]);

export type AppState = ReturnType<typeof appReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
