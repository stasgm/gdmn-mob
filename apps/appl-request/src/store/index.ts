import { combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { configureStore } from '@lib/store';

import { loadDataFromDisk, saveDataToDisk } from '@lib/mobile-app';

export const reducers = {};

const rootReducer = combineReducers(reducers);

export const { store } = configureStore(loadDataFromDisk, saveDataToDisk, reducers);

export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, AppState, null, Action<any>>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
export const useDispatch = useReduxDispatch;
