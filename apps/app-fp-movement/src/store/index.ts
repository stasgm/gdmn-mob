import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { configureStore } from '@lib/store';
import { loadDataFromDisk, saveDataToDisk } from '@lib/mobile-app';

import fpMovementReducer from './app/reducer';
import { FpMovementActionType } from './app/actions';
import { appFpMiddlewareFactory } from './app/middleware';

export { default as fpMovementActions } from './app';
// export { useAppInventoryThunkDispatch } from './app/actions.async';

type TActions = FpMovementActionType;

export const reducers = {
  fpMovement: fpMovementReducer,
};

const appReducer = combineReducers(reducers);

export const { store } = configureStore(loadDataFromDisk, saveDataToDisk, reducers, [], [appFpMiddlewareFactory]);

export type AppState = ReturnType<typeof appReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;
export type AppDispatch = ThunkDispatch<AppState, any, TActions>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
export const useThunkDispatch = () => useReduxDispatch<AppDispatch>();
